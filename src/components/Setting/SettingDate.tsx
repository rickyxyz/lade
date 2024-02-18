import { useCallback } from "react";
import { DateTimeType, StateType } from "@/types";
import { Input } from "../";
import { Setting } from "./Setting";

interface SettingDate {
  name: string;
  stateDate: StateType<DateTimeType | undefined>;
}

export function SettingDate({ name, stateDate }: SettingDate) {
  const setDate = stateDate[1];

  const handleUpdateDate = useCallback(
    (prev: DateTimeType | undefined, raw: string): DateTimeType => {
      const [year, month, date] = raw.split("-") as unknown as number[];

      return {
        ...(prev ?? {}),
        date: {
          year,
          month,
          date,
        },
      };
    },
    []
  );

  const handleUpdateTime = useCallback(
    (prev: DateTimeType | undefined, raw: string): DateTimeType => {
      const [hour, minute] = raw.split(":") as unknown as number[];

      return {
        ...(prev ?? {}),
        time: {
          hour,
          minute,
        },
      };
    },
    []
  );

  return (
    <Setting name={name} classNameChildren="flex gap-4 flex-col md:flex-row">
      <Input
        className="flex-grow"
        type="date"
        onChange={(e) => {
          const string = e.target.value;
          if (string === "")
            setDate((prev) => ({
              ...prev,
              date: undefined,
            }));
          else setDate((prev) => handleUpdateDate(prev, string));
        }}
      />
      <Input
        className="flex-grow"
        type="time"
        onChange={(e) => {
          const string = e.target.value;
          if (string === "")
            setDate((prev) => ({
              ...prev,
              time: undefined,
            }));
          else setDate((prev) => handleUpdateTime(prev, string));
        }}
      />
    </Setting>
  );
}
