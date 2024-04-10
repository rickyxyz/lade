import { useCallback, useMemo } from "react";
import { DateTimeType, StateType } from "@/types";
import { Input } from "../";
import { Setting } from "./Setting";

interface SettingDate {
  name: string;
  dateNum?: number;
  onChange?: (newDate: number) => void;
}

export function SettingDate({ name, dateNum, onChange }: SettingDate) {
  const existing = useMemo(
    () => (dateNum ? new Date(dateNum) : new Date()),
    [dateNum]
  );
  const existingDate = useMemo(() => {
    const month = existing.getMonth() + 1;
    const date = existing.getDate();

    return `${existing.getFullYear()}-${month < 10 ? `0${month}` : month}-${
      date < 10 ? `0${date}` : date
    }`;
  }, [existing]);
  const existingTime = useMemo(() => {
    const hours = existing.getHours();
    const minutes = existing.getMinutes();
    return `${hours < 10 ? `0${hours}` : hours}:${
      minutes < 10 ? `0${minutes}` : minutes
    }`;
  }, [existing]);
  console.log(existingTime);

  const handleUpdateDate = useCallback(
    (raw: string) => {
      const [year, month, date] = raw.split("-") as unknown as number[];

      const newDate = new Date(existing);
      newDate.setFullYear(year);
      newDate.setMonth(month - 1);
      newDate.setDate(date);

      onChange && onChange(newDate.getTime());
    },
    [existing, onChange]
  );

  const handleUpdateTime = useCallback(
    (raw: string) => {
      const [hour, minute] = raw.split(":") as unknown as number[];

      const newDate = new Date(existing);
      newDate.setHours(hour);
      newDate.setMinutes(minute);

      onChange && onChange(newDate.getTime());
    },
    [existing, onChange]
  );

  return (
    <Setting name={name} classNameChildren="flex gap-4 flex-col md:flex-row">
      <Input
        className="flex-grow"
        type="date"
        value={existingDate}
        onChange={(e) => {
          const string = e.target.value;
          console.log(string);
          handleUpdateDate(string);
        }}
      />
      <Input
        className="flex-grow"
        type="time"
        value={existingTime}
        onChange={(e) => {
          const string = e.target.value;
          handleUpdateTime(string);
        }}
      />
    </Setting>
  );
}
