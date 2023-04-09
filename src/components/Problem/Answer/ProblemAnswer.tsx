import { useMemo } from "react";
import { Input } from "@/components";
import { ProblemAnswerType, StateType } from "@/types";

interface ProblemAnswerProps {
  type: ProblemAnswerType;
  stateAnswer: StateType<any>;
  disabled?: boolean;
}

export function ProblemAnswer({
  type,
  stateAnswer,
  disabled,
}: ProblemAnswerProps) {
  const [answer, setAnswer] = stateAnswer;

  const matrixSize = useMemo(() => {
    if (type !== "matrix") return null;

    let maxLength = 0;
    let maxHeight = 0;

    console.log(answer);

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
  }, [answer, type]);

  switch (type) {
    case "matrix":
      const vertical = Array.from({ length: 3 });
      const horizontal = Array.from({ length: 3 });

      return (
        <div className="flex flex-col gap-2 mb-4">
          {answer &&
            vertical.map((_, j) => (
              <div key={`Matrix-${j}`} className="flex gap-2">
                {horizontal.map((_, i) => (
                  <Input
                    key={`Matrix-${j}-${i}`}
                    variant="solid"
                    className="!w-24 text-center"
                    value={(answer as (string | number)[][])[j][i]}
                    onChange={(e: any) => {
                      setAnswer((prev: any) => {
                        const temp = JSON.parse(JSON.stringify(prev));
                        temp[j][i] = e.target.value;
                        for (let y = 0; y <= j; y++) {
                          for (let x = 0; x <= i; x++) {
                            if (temp[y][x] === "" && e.target.value !== "")
                              temp[y][x] = "0";
                          }
                        }
                        return temp;
                      });
                    }}
                    disabled={disabled}
                  />
                ))}
              </div>
            ))}
          {matrixSize && (
            <span>
              Matrix Size: {matrixSize[0]} x {matrixSize[1]}
            </span>
          )}
        </div>
      );
    case "short_answer":
      return (
        <Input
          className="mb-4"
          value={answer}
          onChange={(e: any) => {
            setAnswer(e.target.value);
          }}
          disabled={disabled}
        />
      );
  }

  return <></>;
}
