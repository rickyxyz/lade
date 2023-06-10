import { createContext, useContext, useMemo } from "react";

export const ProblemEditInitializedContext = createContext<
  [boolean, (value: boolean) => void]
  // eslint-disable-next-line @typescript-eslint/no-empty-function
>([false, () => {}]);

export function useProblemEditInitialized() {
  const [initialized, setInitialized] = useContext(
    ProblemEditInitializedContext
  );

  return useMemo(
    () => ({
      initialized,
      setInitialized,
    }),
    [initialized, setInitialized]
  );
}
