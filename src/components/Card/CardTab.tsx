import { ReactNode, useEffect, useMemo, useRef } from "react";
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
  const tabLineLength = useRef(0);
  const tabRef = useRef<HTMLDivElement>(null);
  const tabLineRef = useRef<HTMLDivElement>(null);
  const tabLine2Ref = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initialized = useRef(false);

  const renderTabs = useMemo(
    () =>
      tabs.map(({ id, label, onClick }) => (
        <Tab
          key={id}
          active={id === activeTab}
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
    tabLine.style.width = `${tab.offsetWidth}px`;
    tabLine2.style.width = `${container.offsetWidth - tab.offsetWidth}px`;
    tabLine2.style.left = `${tab.offsetWidth}px`;
  });

  return (
    <div className="flex flex-col" ref={containerRef}>
      <div className="flex w-fit" ref={tabRef}>
        {renderTabs}
      </div>
      <div className="relative flex flex-row h-4">
        <div className="!border-l !h-full" ref={tabLineRef}></div>
        <div
          className="absolute !border-r !border-t !rounded-tr-md !h-full flex-grow"
          style={{
            top: 1,
          }}
          ref={tabLine2Ref}
        ></div>
      </div>
      <Card className={clsx("!rounded-b-md !border-t-0 !pt-4")} {...rest} />
    </div>
  );
}

function Tab({
  active,
  label,
  onClick,
}: {
  label: string;
  onClick: () => void;
  active: boolean;
}) {
  return (
    <Button
      className={clsx(active ? "!border-b-0" : "!bg-gray-50")}
      order="first"
      orderDirection="column"
      variant="outline"
      onClick={onClick}
    >
      {label}
    </Button>
  );
}
