import { useMemo, useEffect, useCallback, useState } from "react";
import { db, populateProblems } from "@/libs/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  QueryConstraint,
} from "firebase/firestore";
import { Button, Card, Paragraph, Select } from "@/components";
import {
  ProblemSortByType,
  ProblemSubtopicNameType,
  ProblemTopicNameType,
  ProblemType,
} from "@/types";
import { deleteDoc, doc } from "firebase/firestore";
import {
  PROBLEM_SORT_BY_OPTIONS,
  PROBLEM_SUBTOPIC_OPTIONS,
  PROBLEM_TOPIC_OPTIONS,
} from "@/consts";
import { ProblemCard, ProblemCardSkeleton } from "../components";
import { PageTemplate } from "@/templates";
import { useDebounce } from "@/hooks";

export function ProblemListPage() {
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [loading, setLoading] = useState(true);

  const stateTopic = useState<ProblemTopicNameType | undefined>();
  const [topic, setTopic] = stateTopic;
  const stateSubtopic = useState<ProblemSubtopicNameType | undefined>();
  const [subtopic, setSubtopic] = stateSubtopic;
  const stateSortBy = useState<ProblemSortByType>("newest");
  const [sortBy, setSortBy] = stateSortBy;
  const debounce = useDebounce();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const resetDatabase = useCallback(async () => {
    console.log("Reset Database!");

    for (const problem of problems) {
      if (problem.id) await deleteDoc(doc(db, "problems", problem.id));
    }

    populateProblems();
  }, [problems]);

  const renderHeader = useMemo(
    () => (
      <Card>
        <h1 className="mb-4">Problems</h1>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col max-w-1/3">
            <h3 className="!text-sm">Topics</h3>
            <Select
              className="w-full"
              inputClassName="w-full"
              options={PROBLEM_TOPIC_OPTIONS}
              selectedOption={topic}
              onSelectOption={(option) => {
                option ? setTopic(option.id) : setTopic(undefined);
                setSubtopic(undefined);
              }}
              unselectedText="Any"
              optional
            />
          </div>
          <div className="flex flex-col w-full">
            <h3 className="!text-sm">Subtopics</h3>
            <Select
              className="w-full"
              inputClassName="w-full"
              options={topic ? PROBLEM_SUBTOPIC_OPTIONS[topic] : []}
              selectedOption={subtopic}
              onSelectOption={(option) => {
                option ? setSubtopic(option.id) : setTopic(undefined);
              }}
              disabled={!topic}
              unselectedText="Any"
              optional
            />
          </div>
          <div className="flex flex-col w-full">
            <h3 className="!text-sm">Sort By</h3>
            <Select
              className="w-full"
              inputClassName="w-full"
              options={PROBLEM_SORT_BY_OPTIONS}
              selectedOption={sortBy}
              onSelectOption={(option) => {
                option && setSortBy(option.id);
              }}
            />
          </div>
        </div>
      </Card>
    ),
    [setSortBy, setSubtopic, setTopic, sortBy, subtopic, topic]
  );

  const renderProblems = useMemo(
    () =>
      loading ? (
        <ProblemCardSkeleton className="w-[28rem]" />
      ) : (
        <div className="flex flex-col gap-8 w-[28rem]">
          {problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ),
    [loading, problems]
  );

  const renderSidebar = useMemo(
    () => (
      <aside className="flex flex-auto flex-col gap-4 !w-fit">
        <div>
          <Paragraph weight="bold">TOPICS</Paragraph>
          <Select
            className="w-full mt-2"
            inputClassName="w-full"
            options={PROBLEM_TOPIC_OPTIONS}
            selectedOption={topic}
            onSelectOption={(option) => {
              option ? setTopic(option.id) : setTopic(undefined);
              setSubtopic(undefined);
            }}
            unselectedText="Any"
            optional
          />
        </div>
        <div>
          <Paragraph weight="bold">SUBTOPICS</Paragraph>
          <ul className="mt-2">
            {Object.entries(PROBLEM_SUBTOPIC_OPTIONS)
              .filter(([group]) => !topic || topic === group)
              .map(([, subtopicGroup]) =>
                subtopicGroup.map(({ id, text }) => (
                  <li key={`filter_${id}`}>
                    <label className="flex mb-2" htmlFor={id}>
                      <input
                        id={id}
                        className="self-start mt-1 mr-2 !w-4 !h-4 accent-teal-600"
                        type="checkbox"
                      />
                      <Paragraph>{text}</Paragraph>
                    </label>
                  </li>
                ))
              )}
          </ul>
        </div>
      </aside>
    ),
    [setSubtopic, setTopic, topic]
  );

  const handleGetProblems = useCallback(async () => {
    setLoading(true);
    const topicConstraint = topic ? where("topic", "==", topic) : undefined;
    const subtopicConstraint =
      topic && subtopic ? where("subtopic", "==", subtopic) : undefined;
    const sortByProps = PROBLEM_SORT_BY_OPTIONS.filter(
      (option) => option.id === sortBy
    )[0];
    const sortByConstraint = orderBy(
      sortByProps.key,
      sortByProps.descending ? "desc" : "asc"
    );
    const constraints = [
      topicConstraint,
      subtopicConstraint,
      sortByConstraint,
    ].filter((constraint) => constraint) as QueryConstraint[];

    const q = query(collection(db, "problems"), ...constraints);

    debounce(async () => {
      await getDocs(q)
        .then((snap) => {
          let results: ProblemType[] = [];

          snap.forEach((doc) => {
            results = [
              ...results,
              {
                id: doc.id,
                ...doc.data(),
              } as ProblemType,
            ];
          });

          setLoading(false);
          setProblems(results);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
        });
    });
  }, [debounce, sortBy, subtopic, topic]);

  useEffect(() => {
    handleGetProblems();
  }, [topic, subtopic, sortBy, handleGetProblems]);

  const renderHead = useMemo(
    () => (
      <Paragraph as="h1" className="mb-8">
        Problems
      </Paragraph>
    ),
    []
  );

  return (
    <PageTemplate head={renderHead} side={renderSidebar}>
      {renderProblems}
    </PageTemplate>
  );
}
