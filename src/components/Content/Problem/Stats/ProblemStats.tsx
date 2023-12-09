import { useMemo } from "react";
import { IconText } from "@/components";
import { IconNameType } from "@/types";
import { BsCheck, BsClipboardCheckFill, BsEyeFill } from "react-icons/bs";
import { IconType } from "react-icons";

type ProblemStatsType = "view" | "solved" | "date";

export interface ProblemStatsDetailProps {
  icon: IconType;
  text: string;
}

export interface ProblemStatsProps {
  type: ProblemStatsType;
  value: number;
}

export function ProblemStats({ type, value }: ProblemStatsProps) {
  const { icon, text } = useMemo<ProblemStatsDetailProps>(() => {
    switch (type) {
      case "date":
        return {
          icon: BsCheck,
          text: new Date(value).toLocaleString("en-GB", { timeZone: "UTC" }),
        };
      case "solved":
        return {
          icon: BsClipboardCheckFill,
          text: `${value} solved`,
        };
      case "view":
        return {
          icon: BsEyeFill,
          text: `${value} views`,
        };
    }
  }, [type, value]);

  // return <span>{props.text}</span>;
  return (
    <IconText IconComponent={icon} text={text} className="text-slate-600" />
  );
}
