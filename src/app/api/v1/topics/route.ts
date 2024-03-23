// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { json } from "@/utils/api";
import { prisma } from "@/libs/prisma";
import { ProblemTopicType } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { API_FAIL_MESSAGE } from "@/consts/api";

export async function GET() {
  let result:
    | {
        topics: ProblemTopicType;
        subTopics: ProblemTopicType;
      }
    | undefined;
  try {
    const allTopics = await prisma.topic.findMany({
      include: {
        problems: {
          select: {
            id: true,
          },
        },
      },
    });
    const allSubtopics = await prisma.subtopic.findMany();
    result = JSON.parse(
      json({
        topics: allTopics,
        subTopics: allSubtopics,
      })
    );
  } catch (e) {
    result = undefined;
  }

  await prisma.$disconnect();

  if (result) {
    return NextResponse.json(result);
  } else {
    return NextResponse.json(
      {
        message: API_FAIL_MESSAGE,
      },
      {
        status: 500,
      }
    );
  }
}
