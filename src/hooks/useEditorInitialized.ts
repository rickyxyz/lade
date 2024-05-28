import { createContext, useContext, useMemo } from "react";

export const EditorInitializedContext = createContext<
  [boolean, (value: boolean) => void]
  // eslint-disable-next-line @typescript-eslint/no-empty-function
>([false, () => {}]);

export function useEditorInitialized() {
  const [initialized, setInitialized] = useContext(EditorInitializedContext);

  return useMemo(
    () => ({
      initialized,
      setInitialized,
    }),
    [initialized, setInitialized]
  );
}
