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
      query: {
        search,
        topic,
        subTopic,
        sort,
        sortBy = "desc",
        page = 1,
        count = 5,
      },
    } = req;

    const topicQuery = topic ? { topicId: topic } : {};
    const subTopicQuery = subTopic ? { subTopicId: subTopic } : {};
    const sortQuery = (() => {
      if (sort === "solveds") {
        return {
          solveds: {
            _count: sortBy,
          },
        };
      }

      return sort
        ? {
            [sort as string]: sortBy,
          }
        : {};
    })();

    const searchQuery = (() => {
      if (search) {
        return {
          title: {
            contains: search,
            mode: "insensitive",
          },
        };
      }
    })();

    const problems = (await prisma.problem.findMany({
      include: {
        topic: true,
        subTopic: true,
        solveds: true,
      },
      where: {
        ...(topicQuery as any),
        ...(subTopicQuery as any),
        ...(searchQuery as any),
      },
      orderBy: {
        ...(sortQuery as any),
      },
      skip: (Number(page) - 1) * Number(count),
      take: Number(count),
    })) as ProblemType[];

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
