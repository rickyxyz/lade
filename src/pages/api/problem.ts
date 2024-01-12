// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { GenericAPIParams, json } from "@/utils/api";
import { ProblemType } from "@/types";
import { getAuthUser } from "@/libs/next-auth/helper";

async function PATCH({ req, res }: GenericAPIParams) {
  try {
    const { body } = req;
    const {
      answer,
      statement,
      subTopicId,
      title,
      topicId,
      type,
      id,
      authorId,
    } = body as unknown as ProblemType;

    await prisma.problem.update({
      where: {
        id,
      },
      data: {
        title,
        statement,
        answer,
        authorId,
        topicId,
        subTopicId,
        type,
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

async function POST({ req, res }: GenericAPIParams) {
  try {
    const { body } = req;

    const {
      answer,
      statement,
      subTopicId,
      title,
      topicId,
      type,
      authorId,
      id,
    } = body as unknown as ProblemType;

    await prisma.problem.create({
      data: {
        id,
        authorId,
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

async function GET({ req, res }: GenericAPIParams) {
  try {
    const {
      query: { id },
    } = req;

    const user = await getAuthUser(req, res);

    if (typeof id === "string") {
      const out = await prisma.problem.findUnique({
        where: {
          id,
        },
        include: {
          solveds: true,
          topic: true,
          subTopic: true,
        },
      });

      const temp = { ...out } as unknown as ProblemType;

      if (
        out &&
        (!user || (temp.authorId !== user.id && user.role !== "admin"))
      ) {
        temp.answer = JSON.stringify({});
      }

      res.status(200).json(JSON.parse(json(temp)));
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

async function DELETE({ req, res }: GenericAPIParams) {
  try {
    const {
      query: { id },
    } = req;

    if (typeof id === "string") {
      await prisma.problem.delete({
        where: {
          id,
        },
      });

      res.status(200).json({ message: "success" });
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
        req,
        res,
      });
      break;
    case "POST":
      await POST({
        req,
        res,
      });
      break;
    case "PATCH":
      await PATCH({
        req,
        res,
      });
      break;
    case "DELETE":
      await DELETE({
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
