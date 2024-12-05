"use client";
import { Prefetch } from "@client-ai/components/prefetch";
import { Recorder } from "@client-ai/components/recorder";
import { useVad } from "@client-ai/vad/use-vad";
import { useWhisper } from "@client-ai/whisper/use-whisper";
import { useState } from "react";

export default function Home() {
  const [transcription, setTranscription] = useState("");
  const { remoteRun } = useWhisper();
  const { recording, processing } = useVad({
    onSpeechEnd: async ({ blob }) => {
      setTranscription(await remoteRun(blob));
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
        ]}
      ></Prefetch>
    </Recorder>
  );
}
