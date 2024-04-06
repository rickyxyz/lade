import dynamic from "next/dynamic";
import { MarkdownEditorLoader } from "./MarkdownEditorLoader";
import { IMarkdownEditor } from "@uiw/react-markdown-editor";
import { useProblemEditInitialized } from "@/hooks";
import { useMemo } from "react";
import { EditorView } from "@codemirror/view";
import clsx from "clsx";
import { FormulaToolbar } from "./FormulaToolbar";

export const MarkdownEditorRaw = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <MarkdownEditorLoader />,
  }
);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MarkdownEditorProps extends IMarkdownEditor {
  maxLength?: number;
}

export function MarkdownEditor({
  height = "200px",
  value,
  maxLength = 200,
  toolbars = ["bold", "italic", "strike", "ulist", "olist", FormulaToolbar],
  toolbarsMode = [],
  ...rest
}: MarkdownEditorProps) {
  const { initialized, setInitialized } = useProblemEditInitialized();

  const exceedsLimit = useMemo(
    () => value && value.length >= maxLength,
    [maxLength, value]
  );

  return (
    <div className="relative border border-secondary-300 rounded-md overflow-hidden">
      <MarkdownEditorRaw
        extensions={[EditorView.lineWrapping]}
        onCreateEditor={() => {
          setInitialized(true);
        }}
        value={value}
        height={height}
        toolbars={toolbars}
        toolbarsMode={toolbarsMode}
        {...rest}
      />
      {initialized && (
        <div
          className={clsx(
            "absolute bottom-4 right-8",
            "text-right",
            exceedsLimit && "text-danger-500"
          )}
        >
          {value?.length ?? 0} / {maxLength}
        </div>
      )}
    </div>
  );
}
