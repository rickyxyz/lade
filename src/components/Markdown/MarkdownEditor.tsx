import dynamic from "next/dynamic";
import { IMarkdownEditor } from "@uiw/react-markdown-editor";
import { useProblemEditInitialized } from "@/hooks";
import { useCallback, useMemo, useState } from "react";
import { EditorView } from "@codemirror/view";
import clsx from "clsx";
import { FormulaToolbar } from "./FormulaToolbar";
import { PreviewToolbar } from "./PreviewToolbar";
import { Markdown } from "./Markdown";
import { Paragraph } from "../Paragraph";
import { Loader } from "../Loader";

export const MarkdownEditorRaw = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Loader caption="loading editor" />,
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
        renderPreview={({ source }) => {
          return (
            <Markdown
              className="w-full h-full text-wrap"
              markdown={source ?? ""}
            />
          );
        }}
        {...rest}
      />
      {initialized && (
        <div className="py-1.5 px-4 bg-secondary-50 border-t border-secondary-4">
          <Paragraph>
            {value?.length ?? 0} / {maxLength}
          </Paragraph>
        </div>
      )}
    </div>
  );
}
