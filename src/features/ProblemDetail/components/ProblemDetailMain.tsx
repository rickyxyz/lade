import {
  Fragment,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Button, Card, Crumb, Icon, More, Paragraph, User } from "@/components";
import { getPermissionForContent, md, parseTopicId } from "@/utils";
import { ProblemType, ContentViewType, StateType, UserType } from "@/types";
import clsx from "clsx";
import { PROBLEM_ANSWER_DEFAULT_VALUES } from "@/consts";
import { validateAnswer } from "@/utils/answer";
import { useAppSelector } from "@/libs/redux";
import { crudData } from "@/libs/firebase";
import { increment } from "firebase/firestore";
import {
  BsCheck,
  BsCheckCircleFill,
  BsChevronLeft,
  BsChevronRight,
  BsPersonFill,
  BsX,
} from "react-icons/bs";
import { ProblemDetailStats } from "./ProblemDetailStats";
import { ProblemDetailTopics } from "./ProblemDetailTopic";
import { ProblemAnswer } from "./ProblemAnswer";
import { useIdentity } from "@/features/Auth";

export interface ProblemMainProps {
  stateProblem: StateType<ProblemType>;
  stateAccept: StateType<unknown>;
  stateMode: StateType<ContentViewType>;
}

export function ProblemDetailMain({
  stateProblem,
  stateAccept,
  stateMode,
}: ProblemMainProps) {
  const [problem, setProblem] = stateProblem;
  const accept = stateAccept[0];

  const {
    id,
    statement,
    title,
    topicId,
    subTopicId,
    solved = 0,
    views = 0,
    type,
    authorId,
  } = problem;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stateUserAnswer = useState<any>();
  const [userAnswer, setUserAnswer] = stateUserAnswer;
  const [userSolved, setUserSolved] = useState(false);
  const [submitted, setSubmitted] = useState<number>();
  const [cooldownIntv, setCooldownIntv] = useState<NodeJS.Timer>();
  const [cooldown, setCooldown] = useState(0);
  const user = useAppSelector("user");
  const setMode = stateMode[1];
  const permission = useMemo(
    () =>
      getPermissionForContent({
        content: problem,
        user,
      }),
    [problem, user]
  );
  const topicText = useMemo(() => parseTopicId(topicId).name, [topicId]);
  const subtopicText = useMemo(
    () => parseTopicId(subTopicId).name,
    [subTopicId]
  );

  const statementRef = useRef<HTMLDivElement>(null);

  const handleCheckAnswer = useCallback(() => {
    console.log("Test: ");
    console.log(accept);
    if (!id || !accept || !userAnswer) return;

    const now = new Date().getTime();

    if (submitted && now - submitted <= 1000 * 5) {
      return;
    }

    const verdict = validateAnswer(
      type,
      (accept as any).content,
      userAnswer.content
    );

    if (cooldownIntv) clearInterval(cooldownIntv);

    setCooldown(5000);

    const interval = setInterval(() => {
      setCooldown((prev) => Math.max(0, prev - 100));
    }, 100);

    setSubmitted(now);
    setUserSolved(verdict);

    if (!verdict) {
      setCooldownIntv(interval);
    } else {
      // crudData("update_problem", {
      //   id,
      //   data: {
      //     solved: increment(1) as unknown as number,
      //   },
      // });
      setProblem((prev) => ({
        ...prev,
        solveds: [],
      }));
    }
  }, [accept, id, submitted, type, userAnswer, cooldownIntv, setProblem]);

  const renderTags = useMemo(
    () => (
      <ProblemDetailTopics
        topic={topicId}
        subTopic={subTopicId}
        className="mb-4"
      />
    ),
    [subTopicId, topicId]
  );

  const renderMain = useMemo(
    () => (
      <>
        {/* <h2 className="mb-2">Problem Statement</h2> */}
        <article className="mb-8" ref={statementRef}></article>
      </>
    ),
    []
  );

  const renderAnswerInputs = useMemo(() => {
    if (userAnswer === undefined || !problem) return;

    return (
      <ProblemAnswer
        type={type}
        stateAnswer={stateUserAnswer}
        disabled={userSolved}
      />
    );
  }, [problem, stateUserAnswer, type, userAnswer, userSolved]);

  const renderAnswerVerdict = useMemo(() => {
    if (submitted) {
      return userSolved ? (
        <Icon IconComponent={BsCheck} size="l" className="text-green-600" />
      ) : (
        <Icon IconComponent={BsX} size="l" className="text-red-600" />
      );
    }
  }, [submitted, userSolved]);

  const renderAnswer = useMemo(
    () => (
      <>
        {/* <div className="flex items-center mb-3">
          <h2>Your Answer</h2>
          {renderAnswerVerdict}
        </div> */}
        {renderAnswerInputs}
        <div className="flex items-center justify-between">
          <Button
            className="w-20"
            disabled={cooldown > 0 || userSolved}
            onClick={handleCheckAnswer}
          >
            {cooldown > 0 && !userSolved
              ? Math.ceil(cooldown / 1000)
              : "Submit"}
          </Button>
        </div>
      </>
    ),
    [cooldown, handleCheckAnswer, renderAnswerInputs, userSolved]
  );

  const handleRenderMarkdown = useCallback(() => {
    if (statementRef.current)
      statementRef.current.innerHTML = md.render(statement);
  }, [statement]);

  const handleInitDefaultAnswer = useCallback(() => {
    setUserAnswer(PROBLEM_ANSWER_DEFAULT_VALUES[type]);
  }, [setUserAnswer, type]);

  useEffect(() => {
    handleInitDefaultAnswer();
  }, [handleInitDefaultAnswer]);

  useEffect(() => {
    handleRenderMarkdown();
  }, [handleRenderMarkdown]);

  const breadCrumb = useMemo(
    () => ["Problem", topicText, subtopicText, title],
    [subtopicText, title, topicText]
  );

  const renderBreadCrumb = useMemo(
    () => (
      <Crumb
        crumbs={[
          {
            text: "Problems",
          },
          {
            text: topicText,
          },
          {
            text: subtopicText,
          },
          {
            text: title,
            color: "secondary-4",
          },
        ]}
      />
    ),
    [subtopicText, title, topicText]
  );

  return (
    <>
      <Card>
        {renderMain}
        {renderAnswer}
      </Card>
    </>
  );
}
