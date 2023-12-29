// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { json } from "@/utils/api";
import { prisma } from "@/libs/prisma";
import { ProblemTopicType } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;

  if (method !== "GET") {
    res.status(405).json({
      message: "fail",
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
      message: "fail",
    });
  }

  await prisma.$disconnect();
}
