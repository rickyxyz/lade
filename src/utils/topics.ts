import { PROBLEM_TOPICS_DETAIL_OBJECT } from "@/consts";
import {
  ProblemAllTopicNameType,
  ProblemTopicNameType,
  ProblemTopicType,
  SelectOptionType,
} from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { API } from "@/api";

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

  const topicOptions = useMemo(
    () =>
      topics.topics
        .map(({ id, name }) => ({
          id,
          text: name,
        }))
        .filter(({ id }) => id) as SelectOptionType<ProblemTopicNameType>[],
    [topics.topics]
  );

  const subTopicOptions = useMemo<
    Record<string, SelectOptionType<ProblemTopicNameType>[]>
  >(
    () =>
      topics.subTopics
        .filter(({ id, topicId }) => id && topicId)
        .map(({ id, name, topicId }) => ({
          id,
          text: name,
          topicId,
        }))
        .reduce((prev, curr) => {
          const topicId = curr.topicId!;
          const existingSubtopics = prev[topicId] ?? [];
          return {
            ...prev,
            [topicId]: [...existingSubtopics, curr as any],
          };
        }, {} as Record<string, SelectOptionType<ProblemTopicNameType>[]>),
    [topics.subTopics]
  );

  const handleGetTopics = useCallback(async () => {
    const existing = localStorage.getItem("topics");

    console.log(existing);

    if (existing) {
      setTopics(JSON.parse(existing));
    } else {
      API("get_topics", {}).then(({ data }) => {
        if (data) {
          setTopics(data);
          localStorage.setItem("topics", JSON.stringify(data));
        }
      });
    }
  }, []);

  useEffect(() => {
    handleGetTopics();
  }, [handleGetTopics]);

  return useMemo(
    () => ({
      allTopics: topics,
      topicOptions,
      subTopicOptions,
    }),
    [subTopicOptions, topicOptions, topics]
  );
}
