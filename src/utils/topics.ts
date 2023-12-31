import { PROBLEM_TOPICS_DETAIL_OBJECT } from "@/consts";
import {
  ProblemAllTopicNameType,
  ProblemTopicNameType,
  ProblemTopicType,
  SelectOptionType,
} from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api";

export function parseTopicId<K extends ProblemAllTopicNameType>(id: K) {
  return PROBLEM_TOPICS_DETAIL_OBJECT[id];
}

export function useTopics() {
  const [topics, setTopics] = useState<{
    topics: ProblemTopicType[];
    subTopics: ProblemTopicType[];
  }>({
    topics: [],
    subTopics: [],
  });

  const handleGetTopics = useCallback(async () => {
    const existing = localStorage.getItem("topics");

    if (existing) {
      setTopics(JSON.parse(existing));
    } else {
      api.get("/topics").then(({ data }) => {
        console.log(data);
        setTopics(data);
        localStorage.setItem("topics", JSON.stringify(data));
      });
    }
  }, []);

  const getSubTopicsFromTopic = useCallback(
    (id: string) => topics.subTopics.filter(({ topicId }) => topicId === id),
    [topics]
  );

  const getTopicOptions = useCallback(
    (ts: ProblemTopicType[]) =>
      ts
        .map(({ id, name }) => ({
          id,
          text: name,
        }))
        .filter(({ id }) => id) as SelectOptionType<ProblemTopicNameType>[],
    []
  );

  useEffect(() => {
    handleGetTopics();
  }, [handleGetTopics]);

  return useMemo(
    () => ({
      allTopics: topics,
      getSubTopicsFromTopic,
      getTopicOptions,
    }),
    [getSubTopicsFromTopic, getTopicOptions, topics]
  );
}
