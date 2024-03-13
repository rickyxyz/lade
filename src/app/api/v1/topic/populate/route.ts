import { prisma } from "@/libs/prisma";
import {
  PROBLEM_TOPICS_DETAIL_OBJECT,
  PROBLEM_TOPICS_RELATIONSHIP_OBJECT,
} from "@/consts";
import { ProblemAllTopicNameType } from "@/types";
import { NextRequest } from "next/server";

export async function POST() {
  let response = Response.json(
    {
      message: "fail",
    },
    {
      status: 500,
    }
  );
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
        await prisma.subtopic.create({
          data: {
            id: subtopic,
            name: PROBLEM_TOPICS_DETAIL_OBJECT[subtopic].name,
            topicId: topic,
          },
        });
      }
    }

    response = Response.json({
      message: "ok",
    });
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  return response;
}
