"use client";
import { Prefetch } from "@client-ai/components/prefetch";
import { Recorder } from "@client-ai/components/recorder";
import { useVad } from "@client-ai/vad/use-vad";
import { useWhisper } from "@client-ai/whisper/use-whisper";
import { useState } from "react";

export default function Local() {
  const [transcription, setTranscription] = useState("");
  const { localRun } = useWhisper();
  const { recording, processing } = useVad({
    onSpeechEnd: async ({ float32Array }) => {
      setTranscription(await localRun(float32Array));
    },
  });

  return (
    <Recorder
      recording={recording}
      processing={processing}
      transcription={transcription}
    >
      <Prefetch
        models={[
          {
            name: "Download VAD",
            path: process.env.VAD_MODEL_PATH!,
          },
          {
            name: "Download WHISPER",
            path: process.env.WHISPER_MODEL_PATH!,
          },
        ]}
      ></Prefetch>
    </Recorder>
  );
}
