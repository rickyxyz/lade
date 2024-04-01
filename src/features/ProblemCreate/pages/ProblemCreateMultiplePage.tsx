import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { PROBLEM_BLANK } from "@/consts";
import { ProblemCreateEditor, ProblemCreateEditorForm } from "../components";
import { PageTemplate } from "@/templates";
import { ProblemType } from "@/types";
import { crudData } from "@/libs/firebase";
import { useDebounce } from "@/hooks";
import { api } from "@/utils/api";
import { useAppSelector } from "@/libs/redux";
import { API } from "@/api";
import { Button, Modal } from "@/components";
import { PROBLEM_PLACEHOLDERS } from "@/libs/firebase/placeholders";
import { ProblemCreateEditorMultiple } from "../components/ProblemCreateEditorMultiple";
import { ProblemCreateEditorMultipleList } from "../components/ProblemCreateEditorMultipleList";
import { ProblemCreateEditorFormMultiple } from "../components/ProblemCreateEditorFormMultiple";

export function ProblemCreateMultiplePage() {
  const stateProblems = useState<ProblemType[]>([
    {
      ...PROBLEM_BLANK,
      title: "Name1",
      id: "0",
    } as unknown as ProblemType,
    {
      ...PROBLEM_BLANK,
      title: "Name2",
      id: "1",
    } as unknown as ProblemType,
    {
      ...PROBLEM_BLANK,
      title: "Name3",
      id: "2",
    } as unknown as ProblemType,
  ]);
  const [problems, setProblems] = stateProblems;

  const stateLoading = useState(false);
  const [, setLoading] = stateLoading;
  const debounce = useDebounce();
  const router = useRouter();
  const user = useAppSelector("user");
  const stateModal = useState(false);
  const setModal = stateModal[1];
  const stateProblemIndex = useState<number | null>(null);
  const [problemIndex, setProblemIndex] = stateProblemIndex;
  const problem = useMemo(
    () =>
      problemIndex !== null && problems[problemIndex]
        ? problems[problemIndex]
        : null,
    [problemIndex, problems]
  );

  const handleSubmitAll = useCallback(async () => {
    setLoading(true);
    await API("post_problems", {
      body: problems,
    })
      .then(() => {
        router.push("/");
      })
      .catch(() => {
        setLoading(false);
      });
  }, [problems, router, setLoading]);

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
            onEdit={(index) => {
              setProblemIndex(index);
            }}
            onAdd={() => {}}
            onDelete={(index) => {
              setProblems((prev) => prev.filter((_, idx) => index !== idx));
            }}
          />
          <ProblemCreateEditorMultipleList
            stateLoading={stateLoading}
            problems={problems}
            onAdd={() => {
              setProblems((prev) => [
                ...prev,
                {
                  ...PROBLEM_BLANK,
                  id: new Date().getTime(),
                },
              ]);
            }}
            onDelete={(index) => {
              setProblems((prev) => prev.filter((_, idx) => index !== idx));
            }}
            onSubmit={handleSubmitAll}
          />
        </div>
      ),
    [
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
