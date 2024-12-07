import { cn } from "@client-ai/lib/utils";
import { AudioLines, Circle } from "lucide-react";
import { FC, PropsWithChildren } from "react";

export const Recorder: FC<
  PropsWithChildren<{
    recording: boolean;
    processing: boolean;
    transcription: string;
  }>
> = ({ recording, processing, transcription, children }) => {
  return (
    <div className="flex flex-col gap-2 items-center justify-center min-h-lvh bg-black">
      <div className="bg-zinc-950 rounded-2xl ring-1 ring-zinc-800 p-8 w-96 flex-col flex gap-4">
        <div className="space-y-4 relative">
          <div
            className={cn("font-medium text-3xl flex items-center gap-4", {
              "text-red-500": recording,
              "text-white": !recording,
            })}
          >
            {recording ? (
              <Circle className="fill-red-500 size-6"></Circle>
            ) : (
              <AudioLines
                className={cn("size-8 fill-green-500 stroke-green-600", {
                  "fill-amber-500 stroke-amber-600": processing,
                })}
              />
            )}
            {recording ? "Recording" : "AI Recorder"}
          </div>
          <div className="text-zinc-200 max-h-32 overflow-auto">
            {transcription ||
              "Here is the demo of client-side AI work with cloud-side AI. Try speak something, the transcription will appear here."}
          </div>
        </div>
        {children}
      </div>
      <div className="text-zinc-500 text-sm hover:text-zinc-300">
        <a href="https://github.com/vthinkxie/ai-recorder" target="_blank">
          Fork me on Github
        </a>
      </div>
    </div>
  );
};
