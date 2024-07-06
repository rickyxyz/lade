import dynamic from "next/dynamic";
import { IMarkdownEditor } from "@uiw/react-markdown-editor";
import { useEditorInitialized } from "@/hooks";
import { ReactNode, useCallback, useMemo, useRef, useState } from "react";
import { EditorView } from "@codemirror/view";
import clsx from "clsx";
import { FormulaToolbar } from "./FormulaToolbar";
import { PreviewToolbar } from "./PreviewToolbar";
import { MarkdownBase } from "./Markdown";
import { Paragraph } from "../Paragraph";
import { Loader } from "../Loader";
import { MarkdownPreview } from "./MarkdownPreview";
import { Button } from "../Button";

export const MarkdownEditorRaw = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Loader caption="loading editor" />,
  }
);

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface MarkdownEditorProps extends IMarkdownEditor {
  label?: string;
  maxLength?: number;
  caption?: ReactNode;
  onSubmit?: () => void;
  submitDisabled?: boolean;
}

export function MarkdownEditor({
  label,
  height = "200px",
  value,
  maxLength = 200,
  toolbars = ["bold", "italic", "strike", "ulist", "olist", FormulaToolbar],
  caption,
  onSubmit,
  submitDisabled,
  ...rest
}: MarkdownEditorProps) {
  const { initialized, setInitialized } = useEditorInitialized();
  const [lastRender, setLastRender] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleUpdateRender = useCallback(() => {
    setLastRender(new Date().getTime());
  }, []);

  return (
    <div className="w-full">
      {label && (
        <Paragraph className="w-40" color="secondary-5">
          {label}
        </Paragraph>
      )}
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
              <MarkdownBase
                className="w-full h-full text-wrap"
                markdown={source ?? ""}
                ref={contentRef}
                onRender={handleUpdateRender}
              />
            );
          }}
          {...rest}
        />
        {initialized && (
          <div className="flex justify-between bg-secondary-50 border-t border-secondary-4">
            <Paragraph className="my-auto py-1.5 px-4">
              {value?.length ?? 0} / {maxLength}
            </Paragraph>
            {onSubmit && (
              <Button
                variant="ghost"
                className="!rounded-none !border-l !border-secondary-5"
                onClick={onSubmit}
                disabled={submitDisabled}
              >
                Post
              </Button>
            )}
          </div>
        )}
      </div>
      {caption}
    </div>
  );
}
