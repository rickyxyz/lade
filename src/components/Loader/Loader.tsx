import { HourglassEmpty } from "@mui/icons-material";
import { Icon } from "../Icon";

export function Loader() {
  return (
    <Icon className="animate-spin" size="l" IconComponent={HourglassEmpty} />
  );
}
