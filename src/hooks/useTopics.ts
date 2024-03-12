import {
  ProblemTopicNameType,
  ProblemTopicType,
  SelectOptionType,
} from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { API } from "@/api";

export function useTopics() {
  const [topics, setTopics] = useState<{
    topics: ProblemTopicType[];
    subTopics: ProblemTopicType[];
  }>({
    topics: [],
    subTopics: [],
  });
  const [loading, setLoading] = useState(true);

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
    setLoading(true);

    console.log(existing);

    if (existing) {
      setTopics(JSON.parse(existing));
      setLoading(false);
    } else {
      API("get_topics", {})
        .then(({ data }) => {
          if (data) {
            setTopics(data);
            localStorage.setItem("topics", JSON.stringify(data));
          }
        })
        .finally(() => {
          setLoading(false);
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
      loading,
    }),
    [loading, subTopicOptions, topicOptions, topics]
  );
}
