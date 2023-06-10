import { LayoutContext } from "@/contexts";
import { useContext, useMemo } from "react";

export function useDevice() {
  const device = useContext(LayoutContext);

  return useMemo(() => device, [device]);
}
