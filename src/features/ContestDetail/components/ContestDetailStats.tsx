import { IconText } from "@/components";
import { SvgIconComponent } from "@mui/icons-material";

export interface ContestStatsDetailProps {
  icon: SvgIconComponent;
  text: string;
}

export function ContestDetailStats({ icon, text }: ContestStatsDetailProps) {
  // return <span>{props.text}</span>;
  return (
    <IconText IconComponent={icon} text={text} className="text-slate-500" />
  );
}
