import { PROBLEM_TOPICS_DETAIL_OBJECT } from "@/consts";
import { ProblemAllTopicNameType } from "@/types";

export function parseTopicId<K extends ProblemAllTopicNameType>(id: K) {
  return PROBLEM_TOPICS_DETAIL_OBJECT[id];
}
