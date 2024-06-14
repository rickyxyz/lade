// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { makeAnswer, validateAnswer } from "@/utils";
import { ProblemAnswerType, ProblemType } from "@/types";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { NextRequest, NextResponse } from "next/server";
import { API_FAIL_MESSAGE } from "@/consts/api";

export async function POST(req: NextRequest) {
  const body = await req.json();

  const { answer, id } = body as unknown as ProblemType;

  let problem: ProblemType | undefined;

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

    const result = await prisma.problem.findUnique({
      where: {
        id: id as unknown as number,
      },
      include: {
        solveds: true,
        topic: true,
        subTopic: true,
      },
    });

    problem = result as unknown as ProblemType;

    console.log(problem);

    if (!result) {
      throw Error("fail");
    }

    if (user) {
      const existing = await prisma.solved.findFirst({
        where: {
          problemId: id as unknown as number,
          userId: user.id,
        },
      });

      if (existing) {
        throw Error("already answered");
      }
    }

    if (!problem) throw Error("fail");

    const { answer: accept } = problem;

    const type = problem.type as unknown as ProblemAnswerType;

    const verdict = validateAnswer(type, JSON.parse(accept), answer);
    console.log(JSON.parse(accept));
    console.log(answer);

    if (user && verdict) {
      console.log("Skipping creating record");
      // await prisma.solved.create({
      //   data: {
      //     problemId: id as unknown as number,
      //     userId: user.id,
      //     answer: JSON.stringify(answer),
      //   },
      // });
    }

    response = NextResponse.json({
      message: verdict ? "correct" : "wrong",
    });
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();

  return response;
}
