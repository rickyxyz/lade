import {
  ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import {
  ProblemAnswer,
  ProblemDetailStats,
  ProblemDetailTopics,
} from "@/features";
import { Button, Card, More, Paragraph } from "@/components";
import { getPermissionForContent, md } from "@/utils";
import { ProblemDatabaseType } from "@/types";
import { useAppSelector } from "@/libs/redux";
import { CheckCircle, Person } from "@mui/icons-material";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";

export interface ProblemCardProps {
  problem: ProblemDatabaseType;
  className?: string;
  isSubmittable?: boolean;
  cooldown: number;
  loading: boolean;
  onClick?: () => void;
  onSubmit: (id: string, answer: any) => Promise<boolean | null>;
}

export function ContestProblemsProblemCard({
  problem,
  className,
  isSubmittable,
  cooldown,
  loading,
  onClick,
  onSubmit,
}: ProblemCardProps) {
  const stateAnswer = useState<any>({
    content: "",
  });
  const [answer, setAnswer] = stateAnswer;
  const [solved, setSolved] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    id,
    statement,
    title,
    topic,
    subTopic,
    solveds = [],
    authorId,
    type,
  } = problem;

  const user = useAppSelector("user");

  const permission = useMemo(
    () =>
      getPermissionForContent({
        content: problem,
        user,
      }),
    [problem, user]
  );

  const statementRef = useRef<HTMLDivElement>(null);

  const renderTags = useMemo(
    () =>
      topic &&
      subTopic && (
        <ProblemDetailTopics
          className="mb-4"
          topic={topic.name}
          subTopic={subTopic.name}
        />
      ),
    [subTopic, topic]
  );

  const renderMain = useMemo(
    () => (
      <>
        <div className="relative flex justify-between mb-2">
          <Paragraph className="mr-16" as="h2" color="primary-6">
            {title}
          </Paragraph>
          {/* <More
            className="!absolute !right-0"
            options={
              permission === "author"
                ? [
                    {
                      id: "edit",
                      element: "Edit",
                      onClick: () => {
                        console.log("Edit");
                      },
                    },
                  ]
                : []
            }
          /> */}
        </div>
        {renderTags}
        <article className="mb-5" ref={statementRef}></article>
      </>
    ),
    [renderTags, title]
  );

  const handleRenderMarkdown = useCallback(() => {
    if (statementRef.current)
      statementRef.current.innerHTML = md.render(statement);
  }, [statement]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

  const handleInitDefaultAnswer = useCallback(() => {
    setAnswer(PROBLEM_ANSWER_DEFAULT_VALUES[type]);
  }, [setAnswer, type]);

  useEffect(() => {
    handleInitDefaultAnswer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderAnswerVerdict = useMemo(() => {
    if (submitted) {
      return solved ? (
        <Paragraph weight="semibold" color="success-5">
          Correct answer
        </Paragraph>
      ) : (
        Boolean(cooldown > 0 && Math.ceil(cooldown / 1000)) && (
          <Paragraph color="danger-5">
            Incorrect answer. You can answer again in{" "}
            {Math.ceil(cooldown / 1000)}s
          </Paragraph>
        )
      );
    }
  }, [cooldown, solved, submitted]);

  return (
    <Card className={className} onClick={onClick}>
      {renderMain}
      <ProblemAnswer
        stateAnswer={stateAnswer}
        type={type}
        onBlur={() => {
          setSubmitted(false);
        }}
      />
      {renderAnswerVerdict}
      <Button
        className="mt-4"
        onClick={() => {
          onSubmit(id as any, answer)
            .then((v) => {
              if (v !== null) setSolved(v);
            })
            .finally(() => {
              setSubmitted(true);
            });
        }}
        disabled={cooldown > 0}
        loading={loading}
      >
        Submit
      </Button>
    </Card>
  );
}
