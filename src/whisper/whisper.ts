import { OnnxWrapper } from "@client-ai/onnx/wrapper";
import ort from "onnxruntime-web";

export class Whisper extends OnnxWrapper {
  private min_length = Int32Array.from({ length: 1 }, () => 1);
  private max_length = Int32Array.from({ length: 1 }, () => 448);
  private num_return_sequences = Int32Array.from({ length: 1 }, () => 1);
  private length_penalty = Float32Array.from({ length: 1 }, () => 1);
  private repetition_penalty = Float32Array.from({ length: 1 }, () => 1);

  constructor(path: string) {
    const options: ort.InferenceSession.SessionOptions = {
      executionProviders: ["wasm"],
      logSeverityLevel: 3,
      logVerbosityLevel: 3,
    };
    super(path, options);
  }

  async run(audio: Float32Array, beams = 1) {
    const audio_pcm = new ort.Tensor(audio, [1, audio.length]);

    // clone semi constants into feed. The clone is needed if we run with ort.env.wasm.proxy=true
    const feed = {
      audio_pcm: audio_pcm,
      max_length: new ort.Tensor(new Int32Array(this.max_length), [1]),
      min_length: new ort.Tensor(new Int32Array(this.min_length), [1]),
      num_beams: new ort.Tensor(
        Int32Array.from({ length: 1 }, () => beams),
        [1],
      ),
      num_return_sequences: new ort.Tensor(
        new Int32Array(this.num_return_sequences),
        [1],
      ),
      length_penalty: new ort.Tensor(new Float32Array(this.length_penalty), [
        1,
      ]),
      repetition_penalty: new ort.Tensor(
        new Float32Array(this.repetition_penalty),
        [1],
      ),
    };

    return this.session.run(feed);
  }
}
