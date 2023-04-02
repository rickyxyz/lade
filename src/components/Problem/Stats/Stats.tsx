import { useMemo } from "react";
import { IconText } from "@/components";
import { IconNameType } from "@/types";

type ProblemStatsType = "view" | "solved" | "date";

export interface ProblemStatsDetailProps {
  icon: IconNameType;
  text: string;
}

export interface ProblemStatsProps {
  type: ProblemStatsType;
  value: number;
}

export function ProblemStats({ type, value }: ProblemStatsProps) {
  const props = useMemo<ProblemStatsDetailProps>(() => {
    switch (type) {
      case "date":
        return {
          icon: "check",
          text: new Date(value).toLocaleString("en-GB", { timeZone: "UTC" }),
        };
      case "solved":
        return {
          icon: "clipboardCheckFill",
          text: `${value} Solved`,
        };
      case "view":
        return {
          icon: "eyeFill",
          text: `${value} Views`,
        };
    }
  }, [type, value]);

  return <IconText {...props} className="text-slate-600" />;
}

const PROBLEM_STATS_PROPS: Record<
  ProblemStatsType,
  Partial<ProblemStatsDetailProps>
> = {
  date: {
    icon: "check",
  },
  solved: {
    icon: "check",
  },
  view: {
    icon: "eyeFill",
  },
};
