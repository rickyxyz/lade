import { useMemo, useEffect, useCallback, useState, useRef } from "react";
import { crudData } from "@/firebase";
import {
  Card,
  Input,
  Markdown,
  PageGenericTemplate,
  Loader,
  ProblemMain,
  ProblemMainSkeleton,
  ProblemSettingSelect,
  Select,
} from "@/components";
import {
  ProblemAnswerType,
  ProblemSubtopicNameType,
  ProblemTopicNameType,
  ProblemTopicSpecificType,
  ProblemType,
  SelectOptionType,
} from "@/types";
import { md } from "@/utils";
import dynamic from "next/dynamic";
import "@uiw/react-markdown-editor/markdown-editor.css";
import "@uiw/react-markdown-preview/markdown.css";
import {
  PROBLEM_ANSWER_DEFAULT_VALUES,
  PROBLEM_TOPICS_DETAIL_OBJECT,
  PROBLEM_TOPICS_RELATIONSHIP_OBJECT,
} from "@/consts";
import { ProblemAnswer } from "@/components/Problem/Answer/ProblemAnswer";

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
  const [problem, setProblem] = useState<ProblemType>();
  const [loading, setLoading] = useState(true);
  const [statement, setStatement] = useState("");

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
        SelectOptionType<ProblemTopicNameType>[]
      >,
    []
  );

  const stateProblemType = useState(optionsProblemType[0]);
  const [problemType, setProblemType] = stateProblemType;
  const stateProblemTopic = useState(optionsProblemTopic[0]);
  const problemTopicName = useMemo(
    () => stateProblemTopic[0].key,
    [stateProblemTopic]
  );
  const stateProblemSubTopic = useState(
    optionsProblemSubTopic[problemTopicName][0]
  );
  const [problemTopic, setProblemTopic] = stateProblemTopic;
  const setProblemSubTopic = stateProblemSubTopic[1];

  const stateAnswer = useState<any>();
  const [answer, setAnswer] = stateAnswer;

  const optionsSpecificProblemSubTopic = useMemo(
    () => optionsProblemSubTopic[problemTopicName],
    [optionsProblemSubTopic, problemTopicName]
  );

  const handleUpdateProblemType = useCallback(
    (newType: SelectOptionType<ProblemAnswerType>) => {
      setProblemType(newType);
      setAnswer(PROBLEM_ANSWER_DEFAULT_VALUES[newType.key]);
    },
    [setAnswer, setProblemType]
  );

  const handleUpdateProblemTopic = useCallback(
    (newTopic: SelectOptionType<ProblemTopicNameType>) => {
      setProblemTopic(newTopic);
      setProblemSubTopic(optionsProblemSubTopic[newTopic.key][0]);
    },
    [optionsProblemSubTopic, setProblemSubTopic, setProblemTopic]
  );

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
            stateObject={[problemType, handleUpdateProblemType]}
            options={optionsProblemType}
          />
          <ProblemSettingSelect
            name="Problem Topic"
            stateObject={[problemTopic, handleUpdateProblemTopic]}
            options={optionsProblemTopic}
          />
          <ProblemSettingSelect
            name="Problem Subtopic"
            stateObject={stateProblemSubTopic}
            options={optionsProblemSubTopic[problemTopicName]}
          />
        </div>
      </section>
    ),
    [
      handleUpdateProblemTopic,
      handleUpdateProblemType,
      optionsProblemSubTopic,
      optionsProblemTopic,
      optionsProblemType,
      problemTopic,
      problemTopicName,
      problemType,
      stateProblemSubTopic,
    ]
  );

  const renderProblemEditor = useMemo(
    () => (
      <section className="border-transparent mb-8" data-color-mode="light">
        <h2 className="mb-4">Problem Statement</h2>
        <Input
          wrapperClassName="w-full mb-4"
          placeholder="Enter problem title here..."
        />
        <MarkdownEditor
          value={statement}
          renderPreview={(props) => {
            const test = props;
            test.source;
            return <Markdown markdown={test.source ?? ""} />;
          }}
          onChange={(e) => setStatement(e)}
          toolbars={["bold", "italic", "strike", "ulist", "olist"]}
        />
      </section>
    ),
    [statement]
  );

  const renderProblemAnswer = useMemo(
    () => (
      <section>
        <h2 className="mb-4">Problem Answer</h2>
        <ProblemAnswer type={problemType.key} stateAnswer={stateAnswer} />
      </section>
    ),
    [problemType.key, stateAnswer]
  );

  return (
    <PageGenericTemplate>
      <Card>
        {renderHead}
        {renderProblemSettings}
        {renderProblemEditor}
        {renderProblemAnswer}
      </Card>
    </PageGenericTemplate>
  );
}
