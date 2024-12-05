import { useCallback, useRef, useState } from "react";

function getSpeechRecognition(): SpeechRecognition | null {
  if (typeof window === "undefined") {
    return null;
  }
  const CompactSpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;
  const speechRecognition = new CompactSpeechRecognition();
  speechRecognition.continuous = true;
  speechRecognition.interimResults = true;
  return speechRecognition;
}

export const useRecognition = () => {
  const [interimTranscript, setInterimTranscript] = useState("");
  const [finalTranscript, setFinalTranscript] = useState("");
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const start = useCallback(() => {
    if (!recognitionRef.current) {
      recognitionRef.current = getSpeechRecognition();
      recognitionRef.current!.onresult = (e) => {
        setInterimTranscript("");
        let i = e.resultIndex;
        for (; i < e.results.length; ++i) {
          const result = e.results[i];
          if (result) {
            if (result.isFinal) {
              setFinalTranscript(result[0].transcript);
            } else {
              setInterimTranscript((t) => t + result[0].transcript);
            }
          }
        }
      };
      recognitionRef.current?.start();
    }
  }, []);
  const stop = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  }, []);

  return {
    start,
    stop,
    interimTranscript,
    finalTranscript,
  };
};
