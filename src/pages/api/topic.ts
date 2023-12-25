// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { json, prisma } from "@/utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;

  if (method !== "GET") {
    res.status(500).json({
      message: "internal server error",
    });
  }

  let result: any;
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
    result = true;
  }

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({
      message: "internal server error",
    });
  }

  await prisma.$disconnect();
}
