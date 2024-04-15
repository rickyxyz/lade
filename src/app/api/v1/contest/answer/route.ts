// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { makeAnswer, validateAnswer } from "@/utils";
import { ProblemAnswerType, ProblemType } from "@/types";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { NextRequest, NextResponse } from "next/server";
import { API_FAIL_MESSAGE } from "@/consts/api";
import { firebase } from "@/libs/firebase-admin";
import { getDatabase, ref, runTransaction } from "firebase/database";
import { rb } from "@/libs/firebase";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { answer, contestId, problemId } = body as {
    answer: any;
    contestId: string;
    problemId: string;
  };

  let response = NextResponse.json(
    {
      message: API_FAIL_MESSAGE,
    },
    {
      status: 500,
    }
  );

  try {
    const user = await getAuthUserNext();

    if (!user) {
      throw Error("fail1");
    }

    console.log("Params");
    console.log({
      answer,
      contestId,
      problemId,
    });

    const result = await prisma.contest.findUnique({
      where: {
        id: contestId as unknown as number,
      },
      include: {
        toProblems: {
          // include: {
          //   problem: true,
          // },
          where: {
            problemId: problemId as unknown as number,
          },
          select: {
            problem: true,
            score: true,
            order: true,
          },
        },
        topic: true,
        subTopic: true,
      },
    });

    if (!result || result.toProblems.length !== 1) throw Error("fail");

    const { problem, score } = result.toProblems[0];
    console.log(problem);

    if (!problem) throw Error("fail2");

    const { answer: accept } = problem;

    console.log("Accept");
    console.log(answer);

    const type = problem.type as unknown as ProblemAnswerType;

    const verdict = validateAnswer(type as any, JSON.parse(accept), answer);
    console.log(JSON.parse(accept));
    console.log(answer);

    const docRef = ref(rb, `contests/${contestId}`);
    const resultingData = {
      score: verdict ? 10 : -10,
      lastSubmitted: new Date().getTime(),
    };
    runTransaction(docRef, (result) => {
      console.log("Previous");
      console.log(result);
      if (result) {
        return {
          ...result,
          [problemId]: {
            ...(result[problemId] ?? {}),
            [user.id]: {
              ...resultingData,
              attempts:
                (result[problemId] && result[problemId][user.id]
                  ? result[problemId][user.id].attempts
                  : 0) + 1,
            },
          },
        };
      } else {
        return {
          [problemId]: {
            [user.id]: {
              ...resultingData,
              attempts: 1,
            },
          },
        };
      }
    });

    response = NextResponse.json({
      message: verdict ? "correct" : "wrong",
    });
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();

  return response;
}
