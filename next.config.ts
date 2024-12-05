import type { NextConfig } from "next";
import NodePolyfillPlugin from "node-polyfill-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  webpack: (config) => {
    config.resolve.extensions.push(".ts", ".tsx");
    config.resolve.fallback = { fs: false };

    config.plugins.push(
      new NodePolyfillPlugin(),
      new CopyPlugin({
        patterns: [
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd-threaded.wasm",
            to: "static/chunks/",
          },
          {
            from: "./node_modules/onnxruntime-web/dist/ort-wasm-simd.wasm",
            to: "static/chunks/",
          },
          {
            from: "./src/vad/data/silero_vad.onnx",
            to: "static/chunks/",
          },
          {
            from: "./src/whisper/data/whisper.onnx",
            to: "static/chunks/",
          },
        ],
      }),
    );

    return config;
  },
  env: {
    VAD_MODEL_PATH: "_next/static/chunks/silero_vad.onnx",
    WHISPER_MODEL_PATH: "_next/static/chunks/whisper.onnx",
  },
};

export default nextConfig;
