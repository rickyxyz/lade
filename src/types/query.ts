import {
  ProblemSortByType,
  ProblemSubtopicNameType,
  ProblemTopicNameType,
} from "./problem";

export interface ProblemQuery {
  search?: string;
  topic?: ProblemTopicNameType;
  subTopic?: ProblemSubtopicNameType;
  sort?: ProblemSortByType;
}
