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
  PROBLEM_ANSWER_TYPE_OPTIONS,
  PROBLEM_BLANK,
  PROBLEM_DEFAULT,
  PROBLEM_SUBTOPIC_OPTIONS,
  PROBLEM_TOPICS_DETAIL_OBJECT,
  PROBLEM_TOPICS_RELATIONSHIP_OBJECT,
  PROBLEM_TOPIC_OPTIONS,
} from "@/consts";
import { FormulaToolbar } from "@/components/Markdown";
import { ProblemEditForm } from "@/components/Problem/Editor";
import { ProblemEdit } from "@/components/Problem/Editor/ProblemEdit";

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
  const [problem, setProblem] = useState<ProblemWithoutIdType>(
    PROBLEM_BLANK as unknown as ProblemWithoutIdType
  );

  const renderHead = useMemo(
    () => <h1 className="mb-8">Create Problem</h1>,
    []
  );

  return (
    <PageGenericTemplate>
      <Card>
        {renderHead}
        <ProblemEdit defaultProblem={problem} />
      </Card>
    </PageGenericTemplate>
  );
}
