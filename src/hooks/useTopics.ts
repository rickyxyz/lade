import {
  ProblemTopicNameType,
  ProblemTopicType,
  SelectOptionType,
} from "@/types";
import { useCallback, useEffect, useMemo, useState } from "react";
import { API } from "@/api";

interface CachedData {
  topics: ProblemTopicType[];
  subTopics: ProblemTopicType[];
  expireAt?: number;
}

export function useTopics() {
  const [topics, setTopics] = useState<CachedData>({
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

    const skipFetch = (() => {
      if (existing) {
        const parsed = JSON.parse(existing) as CachedData;
        const now = new Date().getTime();
        return Boolean(parsed.expireAt && now < parsed.expireAt);
      }

      return false;
    })();

    if (skipFetch && existing) {
      setTopics(JSON.parse(existing));
      setLoading(false);
    } else {
      API("get_topics", {}, {})
        .then(({ data }) => {
          if (data) {
            const expireAt = new Date().getTime() + 1000 * 60 * 60 * 7;

            setTopics(data);
            localStorage.setItem(
              "topics",
              JSON.stringify({
                ...data,
                expireAt,
              } as CachedData)
            );
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
