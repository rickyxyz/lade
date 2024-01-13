// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { json } from "@/utils/api";
import { ProblemType } from "@/types";
import { getServerSession } from "next-auth";
import { authConfig } from "@/libs/next-auth";
import { getAuthUser } from "@/libs/next-auth/helper";

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

  const user = await getAuthUser(req, res);

  let result: ProblemType[] | undefined;
  try {
    const {
      query: { topic, subTopic, sort, sortBy },
    } = req;

    const topicQuery = topic ? { topicId: topic } : {};
    const subTopicQuery = subTopic ? { subTopicId: subTopic } : {};
    const sortQuery =
      sort && sortBy
        ? {
            [sort as string]: sortBy,
          }
        : {};

    const problems = (await prisma.problem.findMany({
      include: {
        topic: true,
        subTopic: true,
        solveds: true,
      },
      where: {
        ...(topicQuery as any),
        ...(subTopicQuery as any),
      },
      orderBy: {
        ...(sortQuery as any),
      },
    })) as ProblemType[];

    console.log("Authed");
    console.log(user);

    const removedAnswers = problems.map((problem) => {
      const temp: ProblemType = { ...problem };
      if (!user || (temp.authorId !== user.id && user.role !== "admin")) {
        temp.answer = JSON.stringify({});
      }
      return temp;
    }, []);

    result = JSON.parse(json(removedAnswers));
  } catch (e) {
    console.log(e);
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
