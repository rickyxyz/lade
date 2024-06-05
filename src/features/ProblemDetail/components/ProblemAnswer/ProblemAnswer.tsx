import { ReactNode, useMemo } from "react";
import { Input, Paragraph } from "@/components";
import { AnswerType, ProblemAnswerType, StateType } from "@/types";

interface ProblemAnswerProps {
  type: ProblemAnswerType;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  stateAnswer: StateType<any>;
  disabled?: boolean;
  label?: string;
  caption?: ReactNode;
  onBlur?: () => void;
}

function getMatrixSize(answer: unknown) {
  let maxLength = 0;
  let maxHeight = 0;

  const castedAnswer = answer as (string | number)[][];

  for (let y = 0; y < 3; y++) {
    if (castedAnswer[y].some((cell) => cell !== "")) {
      maxHeight = Math.max(maxHeight, y + 1);
    }
    for (let x = 0; x < 3; x++) {
      if (castedAnswer[y][x] !== "") {
        maxLength = Math.max(maxLength, x + 1);
      }
    }
  }

  return [maxHeight, maxLength];
}

export function ProblemAnswer({
  type,
  stateAnswer,
  disabled,
  caption,
  label,
  onBlur,
}: ProblemAnswerProps) {
  const [answer, setAnswer] = stateAnswer;

  const renderLabel = useMemo(
    () =>
      label && (
        <Paragraph className="w-40 mt-2" color="secondary-5">
          {label}
        </Paragraph>
      ),
    [label]
  );

  const renderShortAnswerInput = useMemo(() => {
    const { content } = answer as AnswerType<"short_answer">;

    return (
      <div>
        {renderLabel}
        <Input
          defaultValue={content}
          onChange={(e) => {
            const newAnswer: AnswerType<"short_answer"> = {
              content: e.target.value,
            };
            setAnswer(newAnswer);
          }}
          onBlur={onBlur}
          disabled={disabled}
        />
        {caption}
      </div>
    );
  }, [answer, caption, disabled, onBlur, renderLabel, setAnswer]);

  const renderMatrixInput = useMemo(() => {
    const { matrixHeight, matrixWidth, content } =
      answer as AnswerType<"matrix">;
    const vertical = Array.from({ length: 3 });
    const horizontal = Array.from({ length: 3 });
    return (
      <div className="flex flex-col gap-2 mb-4">
        {renderLabel}
        {content &&
          vertical.map((_, j) => (
            <div key={`Matrix-${j}`} className="flex gap-2">
              {horizontal.map((_, i) => (
                <Input
                  key={`Matrix-${j}-${i}`}
                  variant="solid"
                  className="!w-24 text-center"
                  value={content[j] ? content[j][i] : undefined}
                  onBlur={onBlur}
                  onChange={(e) => {
                    setAnswer((prev: unknown) => {
                      // eslint-disable-next-line @typescript-eslint/no-explicit-any
                      const temp = (prev as any).content;
                      temp[j][i] = e.target.value;
                      for (let y = 0; y <= j; y++) {
                        for (let x = 0; x <= i; x++) {
                          if (temp[y][x] === "" && e.target.value !== "")
                            temp[y][x] = "0";
                        }
                      }

                      const [height, width] = getMatrixSize(temp);

                      const newAnswer: AnswerType<"matrix"> = {
                        content: temp,
                        matrixHeight: height,
                        matrixWidth: width,
                      };
                      return newAnswer;
                    });
                  }}
                  disabled={disabled}
                />
              ))}
            </div>
          ))}
        <Paragraph size="s" color="secondary-5">
          Matrix Size: {matrixHeight} x {matrixWidth}
        </Paragraph>
        {caption}
      </div>
    );
  }, [answer, caption, disabled, onBlur, setAnswer]);

  const renderInputs = useMemo(() => {
    if (!answer) return <></>;

    switch (type) {
      case "short_answer":
        return renderShortAnswerInput;
      case "matrix":
        return renderMatrixInput;
      default:
        return <></>;
    }
  }, [answer, renderMatrixInput, renderShortAnswerInput, type]);

  return renderInputs;
}
