import {
  OnSpeechEnd,
  OnSpeechStart,
  SpeechChunks,
} from "@client-ai/vad/speech-chunks";
import { useEffect, useRef, useState } from "react";

export const useVad = ({
  onSpeechStart,
  onSpeechEnd,
}: {
  onSpeechStart?: OnSpeechStart;
  onSpeechEnd: OnSpeechEnd;
}) => {
  const [recording, setRecording] = useState(false);
  const [processing, setProcessing] = useState(false);

  const chunks = useRef(
    () =>
      new SpeechChunks(
        () => {
          setRecording(true);
          onSpeechStart?.();
        },
        async ({ blob, float32Array }) => {
          setRecording(false);
          setProcessing(true);
          await onSpeechEnd({ blob, float32Array });
          setProcessing(false);
        },
      ),
  );
  useEffect(() => {
    const speechChunk = chunks.current();
    void speechChunk.start();
    return () => {
      void speechChunk.close();
    };
  }, []);

  return { recording, processing };
};
