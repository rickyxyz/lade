import { Fragment } from "react";
import { Paragraph } from "../Paragraph";
import { Icon } from "../Icon";
import { BsChevronRight } from "react-icons/bs";
import { FontColor } from "@/consts/style";

interface CrumbType {
  text: string;
  onClick?: () => void;
  color?: FontColor;
}

interface CrumbProps {
  crumbs: CrumbType[];
}

export function Crumb({ crumbs }: CrumbProps) {
  return (
    <div className="flex items-center gap-2 mb-4">
      {crumbs.map(({ text, color, onClick }, idx) => {
        const isFirst = idx === 0;
        return (
          <Fragment key={`Crumb_${idx}`}>
            {!isFirst && <Icon color={color} IconComponent={BsChevronRight} />}
            <Paragraph color={color} onClick={onClick}>
              {text}
            </Paragraph>
          </Fragment>
        );
      })}
    </div>
  );
}
