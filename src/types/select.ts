export type SelectOptionType<K = string> = {
  id: K;
  text: string;
  disabled?: boolean;
};
