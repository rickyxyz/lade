import { Loader } from "../";

export function MarkdownEditorLoader() {
  return (
    <div className="flex flex-col items-center justify-center h-64 text-primary-700">
      <Loader />
      <span className="mt-2 text-primary-700">loading editor</span>
    </div>
  );
}
