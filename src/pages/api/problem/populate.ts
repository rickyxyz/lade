// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import {
  PROBLEM_SAMPLE_1,
  PROBLEM_SAMPLE_2,
  PROBLEM_SAMPLE_3,
  PROBLEM_SAMPLE_4,
  PROBLEM_SAMPLE_5,
  PROBLEM_SAMPLE_6,
  PROBLEM_SAMPLE_7,
} from "@/libs/firebase/placeholders";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;

  if (method !== "POST") {
    res.status(405).json({ message: "fail" });
    return;
  }

  await prisma.problem.deleteMany({});
  try {
    await prisma.problem.createMany({
      data: [
        PROBLEM_SAMPLE_1,
        PROBLEM_SAMPLE_2,
        PROBLEM_SAMPLE_3,
        PROBLEM_SAMPLE_4,
        PROBLEM_SAMPLE_5,
        PROBLEM_SAMPLE_6,
        PROBLEM_SAMPLE_7,
      ].map(({ answer, statement, subTopicId, title, topicId, type, id }) => ({
        id,
        authorId: "admin",
        title,
        type,
        answer,
        statement,
        topicId,
        subTopicId,
        createdAt: new Date(),
      })),
    });

    res.status(200).json(req.body);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "internal server error 2",
    });
  }

  await prisma.$disconnect();
}
