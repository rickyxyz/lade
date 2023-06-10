import dynamic from "next/dynamic";
import { MarkdownEditorLoader } from "./MarkdownEditorLoader";

export const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <MarkdownEditorLoader />,
  }
);
