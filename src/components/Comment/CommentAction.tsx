import clsx from "clsx";
import { Paragraph } from "../Paragraph";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";
import { Icon } from "../Icon";
import { SvgIconComponent } from "@mui/icons-material";

interface CommentActionBaseProps {
  icon: SvgIconComponent;
  label: string;
}

type CommentActionBase = CommentActionBaseProps &
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>;

export function CommentAction({
  label,
  className,
  icon,
  ...rest
}: CommentActionBase) {
  return (
    <button
      className={clsx(
        "flex items-center justify-center gap-2",
        "text-secondary-500 hover:text-secondary-400 disabled:text-secondary-300 cursor-pointer",
        className
      )}
      {...rest}
    >
      <Icon IconComponent={icon} color="inherit" />
      <Paragraph color="inherit">{label}</Paragraph>
    </button>
  );
}
