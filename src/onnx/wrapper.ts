import { OnnxCache } from "@client-ai/onnx/cache";
import * as ort from "onnxruntime-web";
ort.env.wasm.numThreads = 1;

export class OnnxWrapper {
  protected session: ort.InferenceSession;
  private readonly sessionReady: Promise<void>;

  constructor(path: string, options: ort.InferenceSession.SessionOptions) {
    this.sessionReady = this.init(path, options);
  }

  async ready(): Promise<void> {
    await this.sessionReady;
  }

  private async init(
    path: string,
    options: ort.InferenceSession.SessionOptions,
  ) {
    this.session = await OnnxCache.createSession(path, options);
  }

  close(): Promise<void> {
    return this.session.release();
  }
}
