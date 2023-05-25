import { Commands } from "@uiw/react-markdown-editor/cjs/components/ToolBar";
import { MdFunctions } from "react-icons/md";

export const FormulaToolbar: Commands = {
  name: "formula",
  keyCommand: "formula",
  button: { "aria-label": "Add math formula" },
  icon: <MdFunctions />,
  execute: ({ state, view }) => {
    if (!state || !view) return;

    const lineInfo = view.state.doc.lineAt(view.state.selection.main.from);
    const title = lineInfo.text.replace(/^\$+/, "");
    view.dispatch({
      changes: {
        from: lineInfo.from,
        to: lineInfo.to,
        insert: `${title}\$\$`,
      },
      selection: { anchor: lineInfo.to + 1 },
    });
  },
};
