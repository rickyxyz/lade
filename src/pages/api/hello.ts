// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { api } from "@/utils/api";
import {
  PROBLEM_TOPICS_DETAIL_OBJECT,
  PROBLEM_TOPICS_RELATIONSHIP_OBJECT,
} from "@/consts";
import { ProblemAllTopicNameType, ProblemTopicType } from "@/types";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

async function main() {
  /*
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
	*/
  const allTopics = await prisma.topic.findMany();
  const allSubtopics = await prisma.subtopic.findMany();

  return {
    topics: allTopics,
    subtopics: allSubtopics,
  };
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  api(main, req, res);
}
