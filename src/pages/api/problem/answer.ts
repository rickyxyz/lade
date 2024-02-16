// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { makeAnswer, validateAnswer } from "@/utils";
import { ProblemAnswerType, ProblemType } from "@/types";
import { getAuthUser } from "@/libs/next-auth/helper";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;

  if (method !== "POST") {
    res.status(405).json({ message: "fail" });
    return;
  }

  const { body } = req;

  const { answer, id } = body as unknown as ProblemType;

  let problem: ProblemType | undefined;

  try {
    const user = await getAuthUser(req, res);

    const result = await prisma.problem.findUnique({
      where: {
        id: id as number,
      },
      include: {
        solveds: true,
        topic: true,
        subTopic: true,
      },
    });

    problem = result as any;

    console.log(problem);

    if (!result) {
      throw Error("fail1");
    }

    if (user) {
      const existing = await prisma.solved.findFirst({
        where: {
          problemId: id as number,
          userId: user.id,
        },
      });

      if (existing) {
        throw Error("already answered");
      }
    }

    if (!problem) throw Error("fail2");

    const { answer: accept } = problem;

    const type = problem.type as unknown as ProblemAnswerType;

    const verdict = validateAnswer(type as any, JSON.parse(accept), answer);
    console.log(JSON.parse(accept));
    console.log(answer);

    if (user && verdict) {
      await prisma.solved.create({
        data: {
          problemId: id as unknown as number,
          userId: user.id,
          answer: JSON.stringify(answer),
        },
      });
    }

    res.status(200).json({
      message: verdict ? "correct" : "wrong",
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "internal server error",
    });
  }

  await prisma.$disconnect();
}
