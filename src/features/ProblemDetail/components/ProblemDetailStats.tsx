import { IconText } from "@/components";
import { SvgIconComponent } from "@mui/icons-material";

export interface ProblemStatsDetailProps {
  icon: SvgIconComponent;
  text: string;
}

export function ProblemDetailStats({ icon, text }: ProblemStatsDetailProps) {
  // return <span>{props.text}</span>;
  return (
    <IconText IconComponent={icon} text={text} className="text-slate-500" />
  );
}
