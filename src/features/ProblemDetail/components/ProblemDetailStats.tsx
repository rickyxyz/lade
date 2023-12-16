import { IconText } from "@/components";
import { IconType } from "react-icons";

export interface ProblemStatsDetailProps {
  icon: IconType;
  text: string;
}

export function ProblemDetailStats({ icon, text }: ProblemStatsDetailProps) {
  // return <span>{props.text}</span>;
  return (
    <IconText IconComponent={icon} text={text} className="text-slate-600" />
  );
}
