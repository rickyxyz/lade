// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { json, makeAnswer, validateAnswer } from "@/utils";
import { ContestSubmissionType, ProblemAnswerType, ProblemType } from "@/types";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { NextRequest, NextResponse } from "next/server";
import { API_FAIL_MESSAGE } from "@/consts/api";
import { firebase } from "@/libs/firebase-admin";
import { getDatabase, ref, runTransaction } from "firebase/database";
import { rb } from "@/libs/firebase";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { contestId } = body as {
    contestId: string;
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
    if (!contestId) throw Error("fail0");

    const result = await prisma.contest.findUnique({
      where: {
        id: contestId as unknown as number,
      },
      include: {
        toProblems: {
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

    if (!result) throw Error("fail0");

    const problems = result.toProblems;

    if (!problems) throw Error("fail2");

    const docRef = ref(rb, `contests/${contestId}`);

    const placeholders: ContestSubmissionType = {};
    for (let i = 0; i < 60; i++) {
      const index = Math.floor(Math.random() * problems.length);
      const id = String(problems[index].problem.id);
      const { score } = problems[index];
      const user = `user${Math.floor(Math.random() * 20)}`;
      const result = {
        score: Math.floor(Math.random() * 100) < 50 ? score : 0,
        attempts: Math.floor(Math.random() * score),
        answer: "",
        submittedAt: new Date().getTime(),
      };

      placeholders[id] = {
        ...(placeholders[id] ?? {}),
        [user]: result,
      };
    }

    runTransaction(docRef, (result) => {
      console.log("Previous");
      console.log(result);
      return {
        ...(result ?? {}),
        ...placeholders,
      };
    });

    response = NextResponse.json({
      message: "ok",
    });
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();

  return response;
}
