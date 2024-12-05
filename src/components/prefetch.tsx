import { ProgressBar } from "@client-ai/components/progress-bar";
import { OnnxCache } from "@client-ai/onnx/cache";
import { FC, useEffect, useState } from "react";

export const Prefetch: FC<{
  models: Array<{ name: string; path: string }>;
}> = ({ models }) => {
  return (
    <div className="flex flex-col gap-2">
      {models.map(({ name, path }) => {
        return <PrefetchItem key={name} name={name} path={path} />;
      })}
    </div>
  );
};

const PrefetchItem: FC<{ name: string; path: string }> = ({ name, path }) => {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    void OnnxCache.prefetch(path, (progress) => setProgress(progress));
  }, []);
  return <ProgressBar progress={progress} label={name}></ProgressBar>;
};
