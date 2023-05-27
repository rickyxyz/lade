import { useMemo, useEffect, useCallback, useState } from "react";
import { crudData, db, populateProblems } from "@/firebase";
import {
  collection,
  query,
  where,
  getDocs,
  orderBy,
  QueryConstraint,
} from "firebase/firestore";
import {
  Button,
  Card,
  PageGenericTemplate,
  ProblemCard,
  ProblemCardSkeleton,
  Select,
} from "@/components";
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
import { sleep } from "@/utils";

export default function Home() {
  const [problems, setProblems] = useState<ProblemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [fetching, setFetching] = useState(false);

  const stateTopic = useState<ProblemTopicNameType | undefined>();
  const [topic, setTopic] = stateTopic;
  const stateSubtopic = useState<ProblemSubtopicNameType | undefined>();
  const [subtopic, setSubtopic] = stateSubtopic;
  const stateSortBy = useState<ProblemSortByType>("newest");
  const sortBy = stateSortBy[0];

  const resetDatabase = useCallback(async () => {
    console.log("Reset Database!");

    for (const problem of problems) {
      await deleteDoc(doc(db, "problem", problem.id));
    }

    populateProblems();
  }, [problems]);

  const renderHeader = useMemo(
    () => (
      <Card>
        <h1>Problems</h1>
        <Button onClick={resetDatabase}>
          Populate with Placeholder Questions
        </Button>
        <div className="grid grid-cols-3 gap-4">
          <div className="flex flex-col max-w-1/3">
            <h3 className="!text-sm">Topics</h3>
            <Select
              className="w-full"
              inputClassName="w-full"
              options={PROBLEM_TOPIC_OPTIONS}
              stateObject={stateTopic}
              onSelectOption={() => {
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
              stateObject={stateSubtopic}
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
              stateObject={stateSortBy}
            />
          </div>
        </div>
      </Card>
    ),
    [resetDatabase, setSubtopic, stateSortBy, stateSubtopic, stateTopic, topic]
  );

  const renderProblems = useMemo(
    () =>
      loading ? (
        <ProblemCardSkeleton className="mt-8" />
      ) : (
        <div className="mt-8 flex flex-col gap-8">
          {problems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ),
    [loading, problems]
  );

  const handleGetProblems = useCallback(
    async ({
      onSuccess,
      onFail,
    }: {
      onSuccess?: (results: ProblemType[]) => void;
      onFail?: () => void;
    }) => {
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

      const q = query(collection(db, "problem"), ...constraints);

      await sleep(200);

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
          onSuccess && onSuccess(results);
        })
        .catch((e) => {
          console.log(e);
          setLoading(false);
          onFail && onFail();
        });
    },
    [sortBy, subtopic, topic]
  );

  const handleInitialize = useCallback(() => {
    handleGetProblems({});
  }, [handleGetProblems]);

  // useEffect(() => {
  //   handleInitialize();
  // }, [handleInitialize]);

  useEffect(() => {
    console.log("Query: ", topic, ", ", subtopic, ", ", sortBy);
    handleGetProblems({});
  }, [topic, subtopic, sortBy, handleGetProblems]);

  return (
    <PageGenericTemplate header={renderHeader}>
      {renderProblems}
    </PageGenericTemplate>
  );
}
