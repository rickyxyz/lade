// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { json } from "@/utils/api";
import { ProblemType } from "@/types";
import { getAuthUser } from "@/libs/next-auth/helper";
import { isNaN } from "formik";

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

  let result:
    | {
        data: ProblemType[];
        pagination: {
          total_records: number;
          total_pages: number;
          next_page: number | null;
          current_page: number;
          prev_page: number | null;
        };
      }
    | undefined;

  try {
    const {
      query: { search, topic, subTopic, sort, sortBy = "desc" },
    } = req;

    let page = req.query.page as unknown as number;
    page = Number(req.query.page);
    if (isNaN(page)) page = 1;

    let count = req.query.count as unknown as number;
    count = Number(req.query.count);
    if (isNaN(count)) count = 2;

    console.log("Page: ", page);
    console.log("Count: ", count);

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

    const problemCount = await prisma.problem.count({
      where: {
        ...(topicQuery as any),
        ...(subTopicQuery as any),
        ...(searchQuery as any),
      },
    });
    const maxPages = Math.ceil(problemCount / count);

    if (page > maxPages) page = maxPages;
    if (page < 1) page = 1;

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
    })) as unknown as ProblemType[];

    const removedAnswers = problems.map((problem) => {
      const temp: ProblemType = { ...problem };
      if (!user || (temp.authorId !== user.id && user.role !== "admin")) {
        temp.answer = JSON.stringify({});
      }
      return temp;
    }, []);

    result = {
      data: JSON.parse(json(removedAnswers)),
      pagination: {
        total_records: problemCount,
        next_page: page + 1 > maxPages ? null : page + 1,
        current_page: page,
        prev_page: page - 1 < 1 ? null : page - 1,
        total_pages: maxPages,
      },
    };

    console.log("Returning");
  } catch (e) {
    console.log(e);
    result = undefined;
  }

  console.log("API HIT CONFIRMED");

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({
      message: "fail",
    });
  }

  await prisma.$disconnect();
}
