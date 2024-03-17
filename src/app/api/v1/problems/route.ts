// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/libs/prisma";
import { entryObject, json } from "@/utils/api";
import { ProblemType } from "@/types";
import { NextRequest } from "next/server";
import { getAuthUserNext } from "@/libs/next-auth/helper";

export async function GET(req: NextRequest) {
  const user = await getAuthUserNext();
  const searchParams = req.nextUrl.searchParams;

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
    const parPage = searchParams.get("page");
    const parCount = searchParams.get("count");

    const { topic, subTopic, sort, sortBy, search } = entryObject(
      searchParams,
      ["topic", "subTopic", "sort", "sortBy", "search"]
    );

    let page = parPage as unknown as number;
    page = Number(parPage);
    if (isNaN(page)) page = 1;

    let count = parCount as unknown as number;
    count = Number(parCount);
    if (isNaN(count)) count = 2;

    if (count >= 10) count = 10;
    else if (count <= 0) count = 2;

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

    console.log(problems);

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

  await prisma.$disconnect();

  if (result) {
    // res.status(200).json(result);
    console.log(result);
    return Response.json(result);
  } else {
    return Response.json({
      message: API_FAIL_MESSAGE,
    });
  }
}
