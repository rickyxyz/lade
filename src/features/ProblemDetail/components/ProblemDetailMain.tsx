import { useMemo } from "react";
import { Button, Card, MarkdownPreview, Paragraph } from "@/components";
import { ProblemType, StateType, UserType } from "@/types";
import { ProblemAnswer } from "./ProblemAnswer";
import { Comment } from "@/components/Comment";
import { CommentType } from "@/types/comment";
import { ProblemDetailComments } from "./ProblemDetailComments";

export interface ProblemMainProps {
  stateProblem: StateType<ProblemType>;
  stateAccept: StateType<unknown>;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateUserAnswer: StateType<any>;
  stateUserSolved: StateType<boolean>;
  stateSubmited: StateType<number | undefined>;
  stateSolvable: StateType<boolean>;
  stateLoading: StateType<boolean>;
  stateCooldown: StateType<number>;
  stateComments: StateType<CommentType[]>;
  user?: UserType | null;
  handleCheckAnswer: () => Promise<void>;
  className?: string;
}

export function ProblemDetailMain({
  className,
  stateProblem,
  stateUserAnswer,
  stateUserSolved,
  stateSubmited,
  stateSolvable,
  stateLoading,
  stateCooldown,
  stateComments,
  user,
  handleCheckAnswer,
}: ProblemMainProps) {
  const problem = stateProblem[0];
  const { id, description, type } = problem;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userAnswer = stateUserAnswer[0];
  const userSolved = stateUserSolved[0];
  const submitted = stateSubmited[0];
  const cooldown = stateCooldown[0];
  const loading = stateLoading[0];
  const solvable = stateSolvable[0];
  const comments = stateComments[0];

  const renderMain = useMemo(
    () => <MarkdownPreview className="mb-8" markdown={description} />,
    [description]
  );

  const renderAnswerVerdict = useMemo(() => {
    if (userSolved) {
      return (
        <Paragraph weight="semibold" color="success-5">
          Correct answer
        </Paragraph>
      );
    }

    if (
      submitted &&
      Boolean(cooldown > 0 && !userSolved && Math.ceil(cooldown / 1000))
    ) {
      return (
        <Paragraph color="danger-5">
          Incorrect answer. You can answer again in {Math.ceil(cooldown / 1000)}
          s
        </Paragraph>
      );
    }

    return <></>;
  }, [cooldown, submitted, userSolved]);

  const renderAnswerInputs = useMemo(() => {
    if (userAnswer === undefined || !problem) return;

    return (
      <ProblemAnswer
        type={type}
        stateAnswer={stateUserAnswer}
        disabled={userSolved}
        caption={renderAnswerVerdict}
      />
    );
  }, [
    problem,
    renderAnswerVerdict,
    stateUserAnswer,
    type,
    userAnswer,
    userSolved,
  ]);

  const renderAnswer = useMemo(
    () => (
      <>
        {renderAnswerInputs}
        {!userSolved && (
          <div className="flex items-center justify-between mt-8">
            <Button
              className="w-20"
              disabled={!solvable || cooldown > 0 || userSolved || loading}
              loading={loading}
              onClick={handleCheckAnswer}
              label="Submit"
            />
          </div>
        )}
      </>
    ),
    [
      cooldown,
      handleCheckAnswer,
      loading,
      renderAnswerInputs,
      solvable,
      userSolved,
    ]
  );

  return (
    <div className="flex-1 flex flex-col gap-8">
      <Card className={className}>
        {renderMain}
        {renderAnswer}
      </Card>
      <ProblemDetailComments problemId={id} userId={user?.id} />
    </div>
  );
}
