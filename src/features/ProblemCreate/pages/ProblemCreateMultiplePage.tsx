import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PROBLEM_BLANK } from "@/consts";
import { ProblemCreateEditor, ProblemCreateEditorForm } from "../components";
import { PageTemplate } from "@/templates";
import { ProblemType } from "@/types";
import { crudData } from "@/libs/firebase";
import { useDebounce, useTopics } from "@/hooks";
import { api } from "@/utils/api";
import { useAppSelector } from "@/libs/redux";
import { API } from "@/api";
import { Button, Modal } from "@/components";
import { PROBLEM_PLACEHOLDERS } from "@/libs/firebase/placeholders";
import { ProblemCreateEditorMultiple } from "../components/ProblemCreateEditorMultiple";
import { ProblemCreateEditorMultipleList } from "../components/ProblemCreateEditorMultipleList";
import { ProblemCreateEditorFormMultiple } from "../components/ProblemCreateEditorFormMultiple";
import { makeAnswer } from "@/utils";

export function ProblemCreateMultiplePage() {
  const stateProblems = useState<ProblemType[]>([
    {
      ...PROBLEM_BLANK,
      id: "0",
    } as unknown as ProblemType,
  ]);
  const [problems, setProblems] = stateProblems;

  const stateLoading = useState(false);
  const [, setLoading] = stateLoading;
  const debounce = useDebounce();
  const router = useRouter();
  const user = useAppSelector("user");
  const stateProblemIndex = useState<number | null>(null);
  const [problemIndex, setProblemIndex] = stateProblemIndex;
  const problem = useMemo(
    () =>
      problemIndex !== null && problems[problemIndex]
        ? problems[problemIndex]
        : null,
    [problemIndex, problems]
  );

  const {
    allTopics: { topics, subTopics },
  } = useTopics();

  const handleSubmitAll = useCallback(async () => {
    setLoading(true);
    await API("post_problems", {
      body: problems.map((problem) => ({
        ...problem,
        topic: undefined,
        subTopic: undefined,
      })),
    })
      .then(() => {
        router.push("/");
      })
      .catch((e) => {
        setLoading(false);
        console.log(e);
      });
  }, [problems, router, setLoading]);

  const handleUpdateInitialTopics = useCallback(() => {
    setProblems((prev) =>
      prev.map((problem) => ({
        ...problem,
        topic: topics.filter(({ id }) => problem.topicId === id)[0],
        subTopic: subTopics.filter(({ id }) => problem.subTopicId === id)[0],
      }))
    );
  }, [setProblems, subTopics, topics]);

  useEffect(() => {
    handleUpdateInitialTopics();
  }, [handleUpdateInitialTopics]);

  const handleEditProblem = useCallback(
    (index: number) => {
      setProblemIndex(index);
    },
    [setProblemIndex]
  );

  const handleDeleteProblem = useCallback(
    (index: number) => {
      setProblems((prev) => prev.filter((_, idx) => index !== idx));
    },
    [setProblems]
  );

  const handleAddProblem = useCallback(() => {
    setProblems((prev) => {
      const lastProblem = prev.at(-1);

      let newProblem: ProblemType = {
        ...PROBLEM_BLANK,
        id: new Date().getTime().toString(),
      };

      if (lastProblem) {
        newProblem = {
          ...newProblem,
          topic: lastProblem.topic,
          topicId: lastProblem.topicId,
          subTopic: lastProblem.subTopic,
          subTopicId: lastProblem.subTopicId,
        } as unknown as ProblemType;
      }

      return [...prev, newProblem];
    });
  }, [setProblems]);

  const renderContent = useMemo(
    () =>
      problem ? (
        <ProblemCreateEditor
          onSubmit={(problem) => {
            setProblems((prev) => {
              const temp = [...prev];
              if (problemIndex !== null) {
                temp[problemIndex] = problem;
              }
              return temp;
            });
            setProblemIndex(null);
          }}
          stateLoading={stateLoading}
          problem={problem}
          onLeaveEditor={() => {
            setProblemIndex(null);
          }}
        />
      ) : (
        <div className="relative flex-grow flex flex-col-reverse lg:flex-row gap-8">
          <ProblemCreateEditorMultiple
            stateProblems={stateProblems}
            stateLoading={stateLoading}
            onEdit={handleEditProblem}
            onAdd={handleAddProblem}
            onDelete={handleDeleteProblem}
          />
          <ProblemCreateEditorMultipleList
            stateLoading={stateLoading}
            problems={problems}
            onAdd={handleAddProblem}
            onDelete={handleDeleteProblem}
            onSubmit={handleSubmitAll}
          />
        </div>
      ),
    [
      handleAddProblem,
      handleDeleteProblem,
      handleEditProblem,
      handleSubmitAll,
      problem,
      problemIndex,
      problems,
      setProblemIndex,
      setProblems,
      stateLoading,
      stateProblems,
    ]
  );

  return (
    <PageTemplate
      className="flex"
      title={problem ? "Edit Problem" : "Create Problem"}
    >
      {renderContent}
    </PageTemplate>
  );
}
