// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GenericAPIParams, prisma, json } from "@/utils/api";
import {
  PROBLEM_TOPICS_DETAIL_OBJECT,
  PROBLEM_TOPICS_RELATIONSHIP_OBJECT,
} from "@/consts";
import { ProblemAllTopicNameType, ProblemType } from "@/types";
import {
  PROBLEM_SAMPLE_1,
  PROBLEM_SAMPLE_2,
  PROBLEM_SAMPLE_3,
} from "@/libs/firebase/placeholders";

async function POST({ prisma, req, res }: GenericAPIParams) {
  try {
    const { query } = req;
    const {
      answer,
      statement,
      subTopicId,
      title,
      topicId,
      type,
      authorId,
      createdAt,
      id,
      solved,
      updateDate,
      views,
    } = query as unknown as ProblemType;
    await prisma.problem.create({
      data: {
        id,
        authorId: "admin",
        title,
        type,
        answer,
        statement,
        topicId,
        subTopicId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    res.status(200).json({ message: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "fail",
    });
  }
}

async function GET({ prisma, req, res }: GenericAPIParams) {
  try {
    const {
      query: { id },
    } = req;

    if (typeof id === "string") {
      const out = await prisma.problem.findUnique({
        where: {
          id,
        },
      });

      res.status(200).json(JSON.parse(json(out)));
    } else {
      throw Error("id undefined");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "fail",
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      await GET({
        prisma,
        req,
        res,
      });
      break;
    case "POST":
      await POST({
        prisma,
        req,
        res,
      });
      break;
    default:
      res.status(405).json({ message: "fail" });
      break;
  }

  await prisma.$disconnect();
}
