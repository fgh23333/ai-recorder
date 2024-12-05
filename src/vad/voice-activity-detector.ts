import { SileroModel } from "./silero"; // Assuming you have this class implemented
const modelPath = process.env.VAD_MODEL_PATH;

export class VadDetector {
  private model: SileroModel;
  private readonly startThreshold: number;
  private readonly endThreshold: number;
  private readonly samplingRate: number;
  private readonly minSilenceSamples: number;
  private readonly speechPadSamples: number;
  private triggered: boolean;
  private tempEnd: number;
  private currentSample: number;

  constructor(
    startThreshold: number,
    endThreshold: number,
    samplingRate: number,
    minSilenceDurationMs: number,
    speechPadMs: number,
  ) {
    if (samplingRate !== 8000 && samplingRate !== 16000) {
      throw new Error(
        "Does not support sampling rates other than [8000, 16000]",
      );
    }

    this.model = new SileroModel(modelPath!);
    this.startThreshold = startThreshold;
    this.endThreshold = endThreshold;
    this.samplingRate = samplingRate;
    this.minSilenceSamples = (samplingRate * minSilenceDurationMs) / 1000;
    this.speechPadSamples = (samplingRate * speechPadMs) / 1000;
    this.reset();
  }

  reset(): void {
    this.model.resetStates();
    this.triggered = false;
    this.tempEnd = 0;
    this.currentSample = 0;
  }

  async run(
    data: Float32Array,
    returnSeconds: boolean,
  ): Promise<{ start?: number; end?: number }> {
    const windowSizeSamples = data.length;
    this.currentSample += windowSizeSamples;

    // Determine the row length based on the sampling rate
    const rowLength = this.samplingRate === 16000 ? 512 : 256;

    // Calculate the number of rows
    const numRows = Math.ceil(data.length / rowLength);

    // Create the 2D array
    const x: number[][] = [];
    for (let i = 0; i < numRows; i++) {
      const start = i * rowLength;
      const end = Math.min(start + rowLength, data.length);
      x.push(Array.from(data.slice(start, end)));

      // If the last row is not full, pad it with zeros
      if (end - start < rowLength) {
        x[i] = x[i].concat(new Array(rowLength - (end - start)).fill(0));
      }
    }

    let speechProb: number;
    try {
      const speechProbPromise = await this.model.run(x, this.samplingRate);
      speechProb = speechProbPromise[0][0];
      // console.log("The speechProb",speechProb);
    } catch (e) {
      console.log(e);
      return {};
    }

    if (speechProb >= this.startThreshold && this.tempEnd !== 0) {
      this.tempEnd = 0;
    }

    if (speechProb >= this.startThreshold && !this.triggered) {
      this.triggered = true;
      const speechStart = Math.max(
        this.currentSample - this.speechPadSamples,
        0,
      );
      if (returnSeconds) {
        const speechStartSeconds = speechStart / this.samplingRate;
        return { start: Number(speechStartSeconds.toFixed(1)) };
      } else {
        return { start: speechStart };
      }
    }

    if (speechProb < this.endThreshold && this.triggered) {
      if (this.tempEnd === 0) {
        this.tempEnd = this.currentSample;
      }

      if (this.currentSample - this.tempEnd < this.minSilenceSamples) {
        return {};
      } else {
        const speechEnd = this.tempEnd + this.speechPadSamples;
        this.tempEnd = 0;
        this.triggered = false;

        if (returnSeconds) {
          const speechEndSeconds = speechEnd / this.samplingRate;
          return { end: Number(speechEndSeconds.toFixed(1)) };
        } else {
          return { end: speechEnd };
        }
      }
    }

    return {};
  }

  async close(): Promise<void> {
    this.reset();
    await this.model.close();
  }
}
