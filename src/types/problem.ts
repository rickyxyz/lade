export interface ProblemType {
  id: string;
  topics: string[];
  title: string;
  statement: string;
  solved?: number;
  views?: number;
}

export type ProblemWithoutIdType = Omit<ProblemType, "id">;
