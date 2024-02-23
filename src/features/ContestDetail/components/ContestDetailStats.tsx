import { IconText } from "@/components";
import { IconType } from "react-icons";

export interface ContestStatsDetailProps {
  icon: IconType;
  text: string;
}

export function ContestDetailStats({ icon, text }: ContestStatsDetailProps) {
  // return <span>{props.text}</span>;
  return (
    <IconText IconComponent={icon} text={text} className="text-slate-500" />
  );
}
