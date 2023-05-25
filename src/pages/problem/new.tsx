import { useMemo, useEffect, useCallback, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { crudData } from "@/firebase";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  Card,
  Input,
  Markdown,
  PageGenericTemplate,
  Loader,
  ProblemAnswer,
  ProblemSettingSelect,
  Quote,
  Button,
} from "@/components";
import { validateErrors } from "@/utils";
import {
  ProblemAnswerType,
  ProblemDatabaseType,
  ProblemSubtopicNameType,
  ProblemTopicNameType,
  ProblemType,
  ProblemWithoutIdType,
  SelectOptionType,
} from "@/types";
import {
  PROBLEM_ANSWER_DEFAULT_VALUES,
  PROBLEM_DEFAULT,
  PROBLEM_TOPICS_DETAIL_OBJECT,
  PROBLEM_TOPICS_RELATIONSHIP_OBJECT,
} from "@/consts";

const MarkdownEditor = dynamic(
  () => import("@uiw/react-markdown-editor").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => (
      <Card className="flex flex-col items-center justify-center h-64 text-teal-700">
        <Loader />
        <span className="mt-2 text-teal-700">loading editor...</span>
      </Card>
    ),
  }
);

export default function Problem() {
  const [problem, setProblem] = useState<ProblemWithoutIdType>(PROBLEM_DEFAULT);
  const stateAnswer = useState<any>(problem.answer);
  const [answer, setAnswer] = stateAnswer;
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});
  const router = useRouter();

  const problemComplete = useMemo<ProblemDatabaseType>(
    () =>
      ({
        ...problem,
        answer: JSON.stringify(answer) as any,
      } as unknown as ProblemDatabaseType),
    [answer, problem]
  );

  const optionsProblemType = useMemo<SelectOptionType<ProblemAnswerType>[]>(
    () => [
      { key: "short_answer", text: "Short Answer" },
      { key: "matrix", text: "Matrix" },
    ],
    []
  );

  const optionsProblemTopic = useMemo<SelectOptionType<ProblemTopicNameType>[]>(
    () => [
      { key: "calculus", text: "Calculus" },
      { key: "linear-algebra", text: "Linear Algebra" },
    ],
    []
  );

  const optionsProblemSubTopic = useMemo(
    () =>
      Object.entries(PROBLEM_TOPICS_RELATIONSHIP_OBJECT).reduce(
        (prev, [key, value]) => ({
          ...prev,
          [key]: value.map((subtopic) => ({
            key: subtopic,
            text: PROBLEM_TOPICS_DETAIL_OBJECT[subtopic].name,
          })),
        }),
        {}
      ) as Record<
        ProblemTopicNameType,
        SelectOptionType<ProblemSubtopicNameType>[]
      >,
    []
  );

  const handleUpdateProblemState = useCallback(
    (overrideProperties: (problem: ProblemType) => ProblemType) => {
      setProblem((prev) => {
        const temp: ProblemType = JSON.parse(JSON.stringify(prev));
        return overrideProperties(temp);
      });
    },
    []
  );

  const handleUpdateType = useCallback(
    (newType: ProblemAnswerType) => {
      handleUpdateProblemState((input) => {
        input.type = newType;
        input.answer = PROBLEM_ANSWER_DEFAULT_VALUES[newType];
        return input;
      });
      setAnswer(PROBLEM_ANSWER_DEFAULT_VALUES[newType] as any);
    },
    [handleUpdateProblemState, setAnswer]
  );

  const handleUpdateTopic = useCallback(
    (newTopic: ProblemTopicNameType) => {
      handleUpdateProblemState((input) => {
        input.topic = newTopic;
        input.subtopic = optionsProblemSubTopic[newTopic][0].key;
        return input;
      });
    },
    [handleUpdateProblemState, optionsProblemSubTopic]
  );

  const handleUpdateSubTopic = useCallback(
    (newTopic: ProblemSubtopicNameType) => {
      handleUpdateProblemState((input) => {
        input.subtopic = newTopic;
        return input;
      });
    },
    [handleUpdateProblemState]
  );

  const handleUpdateStatement = useCallback(
    (newStatement: any) => {
      handleUpdateProblemState((input) => {
        input.statement = newStatement;
        return input;
      });
    },
    [handleUpdateProblemState]
  );

  const handleValidate = useCallback(async () => {
    const errors = validateErrors(problemComplete);

    if (Object.keys(errors).length === 0) {
      setLoading(true);

      await crudData("set_problem", {
        data: problemComplete,
      })
        .then(() => {
          router.replace("/");
        })
        .catch(() => {
          setLoading(false);
        });
    }
  }, [problemComplete, router]);

  const renderHead = useMemo(
    () => <h1 className="mb-8">Create Problem</h1>,
    []
  );

  const renderProblemSettings = useMemo(
    () => (
      <section className="mb-8">
        <h2 className="mb-4">Problem Settings</h2>
        <div className="flex flex-col gap-4">
          <ProblemSettingSelect
            name="Problem Type"
            stateObject={[problem.type, handleUpdateType]}
            options={optionsProblemType}
          />
          <ProblemSettingSelect
            name="Problem Topic"
            stateObject={[problem.topic, handleUpdateTopic]}
            options={optionsProblemTopic}
          />
          <ProblemSettingSelect
            name="Problem Subtopic"
            stateObject={[problem.subtopic, handleUpdateSubTopic]}
            options={optionsProblemSubTopic[problem.topic]}
          />
        </div>
      </section>
    ),
    [
      handleUpdateTopic,
      handleUpdateType,
      handleUpdateSubTopic,
      optionsProblemSubTopic,
      optionsProblemTopic,
      optionsProblemType,
      problem,
    ]
  );

  const renderProblemEditor = useMemo(
    () => (
      <section className="border-transparent mb-8" data-color-mode="light">
        <h2 className="mb-4">Problem Statement</h2>
        <Input
          externalWrapperClassName="mb-4"
          wrapperClassName="w-full"
          placeholder="Enter problem title here..."
          value={problem.title}
          onChange={(e) => {
            setProblem((prev) => {
              const temp: ProblemType = JSON.parse(JSON.stringify(prev));
              temp.title = e.target.value;
              return temp;
            });
          }}
          errorText={errors["title"]}
        />
        <div className="mb-4">
          <MarkdownEditor
            value={problem.statement}
            renderPreview={({ source }) => {
              return <Markdown markdown={source ?? ""} />;
            }}
            onChange={(e) => handleUpdateStatement(e)}
            toolbars={["bold", "italic", "strike", "ulist", "olist"]}
          />
          {errors["statement"] && (
            <div className="text-red-600 mt-2">{errors["statement"]}</div>
          )}
        </div>
      </section>
    ),
    [problem.title, problem.statement, errors, handleUpdateStatement]
  );

  const renderProblemAnswer = useMemo(
    () => (
      <section className="mb-4">
        <h2 className="mb-4">Problem Answer</h2>
        <ProblemAnswer
          type={problem.type}
          stateAnswer={stateAnswer}
          caption={
            errors["answer"] && (
              <div className="text-red-600 mt-2">{errors["answer"]}</div>
            )
          }
        />
        <Quote icon="infoCircleFill">
          If the answer is a non-integer number, you should indicate the user to
          which place the answer should be accurate to.
        </Quote>
      </section>
    ),
    [errors, problem.type, stateAnswer]
  );

  useEffect(() => {
    setErrors(validateErrors(problemComplete));
  }, [problem, problemComplete]);

  return (
    <PageGenericTemplate>
      <Card>
        {renderHead}
        {renderProblemSettings}
        {renderProblemEditor}
        {renderProblemAnswer}
        <Button loading={loading} onClick={handleValidate}>
          Submit
        </Button>
      </Card>
    </PageGenericTemplate>
  );
}
