// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GenericAPIParams, getPrisma } from "@/utils/api";
import {
  PROBLEM_TOPICS_DETAIL_OBJECT,
  PROBLEM_TOPICS_RELATIONSHIP_OBJECT,
} from "@/consts";
import { ProblemAllTopicNameType } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const prisma = getPrisma();
  const { method } = req;

  if (method !== "POST") {
    res.status(500).json({
      error: "internal server error",
    });
    return;
  }

  try {
    await prisma.subtopic.deleteMany({});
    await prisma.topic.deleteMany({});

    for (const entry of Object.entries(PROBLEM_TOPICS_RELATIONSHIP_OBJECT)) {
      const topic = entry[0] as unknown as ProblemAllTopicNameType;
      const subtopics = entry[1];
      console.log(
        "Looping Through: ",
        topic,
        PROBLEM_TOPICS_DETAIL_OBJECT[topic].name,
        " > ",
        subtopics.length
      );

      await prisma.topic.create({
        data: {
          id: topic,
          name: PROBLEM_TOPICS_DETAIL_OBJECT[topic].name,
        },
      });

      for (const subtopic of subtopics) {
        console.log(
          "    Looping Through: ",
          PROBLEM_TOPICS_DETAIL_OBJECT[subtopic].name
        );
        await prisma.subtopic.create({
          data: {
            id: subtopic,
            name: PROBLEM_TOPICS_DETAIL_OBJECT[subtopic].name,
            topicId: topic,
          },
        });
      }
    }

    res.status(200).json(req.body);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "internal server error",
    });
  }

  await prisma.$disconnect();
}
