import { CSSProperties, ReactNode, useEffect, useMemo, useRef } from "react";
import { Card, CardProps } from "./Card";
import { Button } from "../Button";
import clsx from "clsx";

export interface CardTabType<T extends string> {
  id: T;
  label: string;
  onClick: () => void;
}

interface CardTabProps<T extends string> extends CardProps {
  tabs: CardTabType<T>[];
  activeTab: string;
}

export function CardTab<T extends string>({
  tabs,
  activeTab,
  ...rest
}: CardTabProps<T>) {
  const renderTabs = useMemo(
    () =>
      tabs.map(({ id, label, onClick }, index) => (
        <Tab
          className={clsx(
            "flex-grow",
            id === activeTab ? "border-b-0 bg-white" : "bg-secondary-50"
          )}
          style={{
            marginLeft: `-${index}px`,
          }}
          key={id}
          label={label}
          onClick={onClick}
        />
      )),
    [activeTab, tabs]
  );

  return (
    <div className="flex flex-col border-secondary-300">
      <div className="relative flex">{renderTabs}</div>
      <Card
        className={clsx("rounded-b-md border-inherit border-t-0")}
        {...rest}
      />
    </div>
  );
}

function Tab({
  className,
  label,
  onClick,
  style,
}: {
  label: string;
  onClick: () => void;
  className: string;
  style?: CSSProperties;
}) {
  return (
    <Button
      className={className}
      textClassName="text-secondary-800"
      order="first"
      orderDirection="column"
      variant="outline"
      onClick={onClick}
      style={style}
      label={label}
    />
  );
}
