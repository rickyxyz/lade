import { LinkPermissionType } from "@/types";
import { SvgIconComponent } from "@mui/icons-material";

export interface NavLink {
  label: string;
  href?: string;
  onClick?: () => void;
  main?: boolean;
  danger?: boolean;
  icon: SvgIconComponent;
  permission?: LinkPermissionType;
}

export interface NavGroup {
  name: string;
  links: NavLink[];
  permission?: LinkPermissionType;
}
