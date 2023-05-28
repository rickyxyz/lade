import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
} from "react";

export const ProblemEditInitializedContext = createContext<
  [boolean, (value: boolean) => void]
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
