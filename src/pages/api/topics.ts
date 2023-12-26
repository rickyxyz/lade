// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getPrisma, json } from "@/utils/api";
import { ProblemTopicType } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const prisma = getPrisma();
  const { method } = req;

  if (method !== "GET") {
    res.status(500).json({
      error: "internal server error",
    });
    return;
  }

  let result:
    | {
        topics: ProblemTopicType;
        subtopics: ProblemTopicType;
      }
    | undefined;
  try {
    const allTopics = await prisma.topic.findMany();
    const allSubtopics = await prisma.subtopic.findMany();
    result = JSON.parse(
      json({
        topics: allTopics,
        subtopics: allSubtopics,
      })
    );
  } catch (e) {
    result = undefined;
  }

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({
      error: "internal server error",
    });
  }

  await prisma.$disconnect();
}
