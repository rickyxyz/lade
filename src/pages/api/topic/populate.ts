// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GenericAPIParams, prisma } from "@/utils/api";
import {
  PROBLEM_TOPICS_DETAIL_OBJECT,
  PROBLEM_TOPICS_RELATIONSHIP_OBJECT,
} from "@/consts";
import { ProblemAllTopicNameType } from "@/types";

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

  try {
    await prisma.subtopic.deleteMany({});
    await prisma.topic.deleteMany({});

    let i = 1;
    let j = 1;
    for (const entry of Object.entries(PROBLEM_TOPICS_RELATIONSHIP_OBJECT)) {
      const topic = entry[0] as unknown as ProblemAllTopicNameType;
      const subtopics = entry[1];
      console.log(
        "Looping Through: ",
        PROBLEM_TOPICS_DETAIL_OBJECT[topic].name,
        " > ",
        subtopics.length
      );

      await prisma.topic.create({
        data: {
          id: i,
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
            id: j,
            name: PROBLEM_TOPICS_DETAIL_OBJECT[subtopic].name,
            topicId: i,
          },
        });
        j++;
      }

      i++;
    }

    res.status(200).json({
      message: "success",
    });
  } catch (e) {
    res.status(500).json({
      message: "internal server error",
    });
  }

  await prisma.$disconnect();
}
