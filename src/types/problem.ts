export interface ProblemType {
  id: string;
  topics: string[];
  title: string;
  statement: string;
  solved?: number;
  views?: number;
}
