import { useProblemEditInitialized } from "@/hooks";
import { Card, Loader } from "../";
import { useEffect } from "react";

export function MarkdownEditorLoader() {
  const { setInitialized } = useProblemEditInitialized();

  useEffect(() => {
    return () => {
      setInitialized(true);
    };
  }, [setInitialized]);

  return (
    <Card className="flex flex-col items-center justify-center h-64 text-primary-700">
      <Loader />
      <span className="mt-2 text-primary-700">loading editor...</span>
    </Card>
  );
}
