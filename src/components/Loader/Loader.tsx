import { BiLoaderAlt } from "react-icons/bi";
import { Icon } from "../Icon";

export function Loader() {
  return <Icon className="animate-spin" size="l" IconComponent={BiLoaderAlt} />;
}
