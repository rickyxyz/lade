export interface DateType {
  year: number;
  month: number;
  date: number;
}

export interface TimeType {
  hour: number;
  minute: number;
}

export interface DateTimeType {
  date?: DateType;
  time?: TimeType;
}
