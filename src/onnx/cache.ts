import * as ort from "onnxruntime-web";

interface ProgressCallback {
  (progress: number): void;
}

export class OnnxCache {
  private static CACHE_NAME = "onnx-model-cache";

  /**
   * Prefetch and cache ONNX model
   */
  static async prefetch(
    modelUrl: string,
    onProgress?: ProgressCallback,
  ): Promise<void> {
    try {
      await this.getModelBuffer(modelUrl, onProgress);
    } catch (error) {
      console.error("Prefetch failed:", error);
      throw error;
    }
  }

  /**
   * Load from cache or download and cache ONNX model
   */
  static async getModelBuffer(
    modelUrl: string,
    onProgress?: ProgressCallback,
  ): Promise<ArrayBuffer> {
    // Check if Cache API is supported
    if (!("caches" in window)) {
      return await this.fetchModel(modelUrl, onProgress);
    }

    try {
      const cache = await caches.open(this.CACHE_NAME);
      let modelResponse = await cache.match(modelUrl);

      if (!modelResponse) {
        // If not in cache, fetch and store in cache
        const fetchResponse = await this.fetchWithProgress(
          modelUrl,
          onProgress,
        );
        // Clone response to use for both caching and returning
        const clonedResponse = fetchResponse.clone();
        await cache.put(modelUrl, clonedResponse);
        modelResponse = fetchResponse;
      } else if (onProgress) {
        // If model is in cache, report 100% progress immediately
        onProgress(100);
      }

      return await modelResponse.arrayBuffer();
    } catch (error) {
      console.error("Cache operation failed:", error);
      // If caching fails, fetch model directly
      return await this.fetchModel(modelUrl, onProgress);
    }
  }

  /**
   * Fetch model directly without using cache
   */
  private static async fetchModel(
    modelUrl: string,
    onProgress?: ProgressCallback,
  ): Promise<ArrayBuffer> {
    const response = await this.fetchWithProgress(modelUrl, onProgress);
    return await response.arrayBuffer();
  }

  /**
   * Fetch with progress tracking
   */
  private static async fetchWithProgress(
    modelUrl: string,
    onProgress?: ProgressCallback,
  ): Promise<Response> {
    const response = await fetch(modelUrl);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!onProgress) {
      return response;
    }

    const contentLength = Number(response.headers.get("content-length"));
    if (!contentLength) {
      console.warn("Content length not available, progress tracking disabled");
      return response;
    }

    const reader = response.body!.getReader();
    const stream = new ReadableStream({
      async start(controller) {
        let receivedLength = 0;

        try {
          const processChunk = async () => {
            for await (const chunk of OnnxCache.iterateReader(reader)) {
              receivedLength += chunk.length;
              const progress = (receivedLength / contentLength) * 100;
              onProgress(Math.round(progress));
              controller.enqueue(chunk);
            }
            onProgress(100);
          };

          await processChunk();
        } finally {
          controller.close();
          reader.releaseLock();
        }
      },
    });

    return new Response(stream, {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    });
  }

  /**
   * Helper async iterator for ReadableStreamDefaultReader
   */
  private static async *iterateReader(
    reader: ReadableStreamDefaultReader<Uint8Array>,
  ) {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      yield value;
    }
  }

  /**
   * Create InferenceSession with cache support
   */
  static async createSession(
    modelUrl: string,
    options?: ort.InferenceSession.SessionOptions,
    onProgress?: ProgressCallback,
  ): Promise<ort.InferenceSession> {
    const modelBuffer = await this.getModelBuffer(modelUrl, onProgress);
    return await ort.InferenceSession.create(modelBuffer, options);
  }

  /**
   * Clear cache for specific model
   */
  static async clearModelCache(modelUrl: string): Promise<boolean> {
    if (!("caches" in window)) {
      return false;
    }

    try {
      const cache = await caches.open(this.CACHE_NAME);
      return await cache.delete(modelUrl);
    } catch (error) {
      console.error("Failed to clear cache:", error);
      return false;
    }
  }

  /**
   * Clear all model caches
   */
  static async clearAllCache(): Promise<boolean> {
    if (!("caches" in window)) {
      return false;
    }

    try {
      return await caches.delete(this.CACHE_NAME);
    } catch (error) {
      console.error("Failed to clear all caches:", error);
      return false;
    }
  }
}
