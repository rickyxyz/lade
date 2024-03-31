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
  const tabRef = useRef<HTMLDivElement>(null);
  const tabLineRef = useRef<HTMLDivElement>(null);
  const tabLine2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const renderTabs = useMemo(
    () =>
      tabs.map(({ id, label, onClick }, index) => (
        <Tab
          className={clsx(
            id === activeTab ? "!border-b-0" : "!bg-secondary-50"
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

  useEffect(() => {
    const tab = tabRef.current;
    const tabLine = tabLineRef.current;
    const tabLine2 = tabLine2Ref.current;
    const container = containerRef.current;

    if (!tab || !tabLine || !tabLine2 || !container) return;
    const w = tab.getBoundingClientRect().width;
    tabLine.style.width = `${w}px`;
    console.log(tab.getClientRects());
    tabLine2.style.width = `${container.offsetWidth - w + 2}px`;
    tabLine2.style.left = `${w - 2}px`;
  });

  return (
    <div className="flex flex-col" ref={containerRef}>
      <div className="relative flex w-fit" ref={tabRef}>
        {renderTabs}
      </div>
      <div className="relative flex flex-row h-4 bg-white">
        <div className="!h-full !border-l" ref={tabLineRef}></div>
        <div
          className="absolute !border-r !border-t !rounded-tr-md !h-full flex-grow"
          style={{
            marginTop: -1,
          }}
          ref={tabLine2Ref}
        ></div>
      </div>
      <Card className={clsx("!rounded-b-md !border-t-0 !pt-4")} {...rest} />
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
      order="first"
      orderDirection="column"
      variant="outline"
      onClick={onClick}
      style={style}
    >
      {label}
    </Button>
  );
}
