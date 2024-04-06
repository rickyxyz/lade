import { Visibility } from "@mui/icons-material";
import { Commands } from "@uiw/react-markdown-editor/cjs/components/ToolBar";

export function PreviewToolbar(onClick: () => void): Commands {
  return {
    name: "preview",
    keyCommand: "preview",
    button: { "aria-label": "Preview" },
    icon: <Visibility />,
    execute: onClick,
  };
}
