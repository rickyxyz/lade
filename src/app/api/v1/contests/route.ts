// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/libs/prisma";
import { entryObject, json } from "@/utils/api";
import { ContestDatabaseType } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { API_FAIL_MESSAGE } from "@/consts/api";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;

  let result:
    | {
        data: ContestDatabaseType[];
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
    const {
      search,
      topic,
      subTopic,
      sort,
      sortBy = "desc",
    } = entryObject(searchParams, [
      "search",
      "topic",
      "subTopic",
      "sort",
      "sortBy",
    ]);

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
      // if (sort === "solveds") {
      //   return {
      //     solveds: {
      //       _count: sortBy,
      //     },
      //   };
      // }

      return sort
        ? {
            [sort as string]: sortBy,
          }
        : {};
    })();

    const searchQuery = (() => {
      if (search) {
        return {
          title: search,
        };
      }
      return {};
    })();

    const contestCount = await prisma.contest.count({
      where: {
        ...topicQuery,
        ...subTopicQuery,
        ...searchQuery,
      },
    });
    const maxPages = Math.ceil(contestCount / count);

    if (page > maxPages) page = maxPages;
    if (page < 1) page = 1;

    const contests = await prisma.contest.findMany({
      include: {
        _count: {
          select: { toProblems: true },
        },
        topic: true,
        subTopic: true,
      },
      where: {
        ...topicQuery,
        ...subTopicQuery,
        ...searchQuery,
      },
      orderBy: {
        ...sortQuery,
      },
      skip: (Number(page) - 1) * Number(count),
      take: Number(count),
    });

    const parsedProblems = (
      JSON.parse(json(contests)) as ContestDatabaseType[]
    ).map((contest) => {
      const custom = { ...contest };
      custom.problemsCount = custom._count ? custom._count.toProblems : 0;
      delete custom._count;
      return custom;
    }) as ContestDatabaseType[];

    result = {
      data: parsedProblems,
      pagination: {
        total_records: contestCount,
        next_page: page + 1 > maxPages ? null : page + 1,
        current_page: page,
        prev_page: page - 1 < 1 ? null : page - 1,
        total_pages: maxPages,
      },
    };

    console.log("Returning");
    console.log(result);
  } catch (e) {
    console.log(e);
    result = undefined;
  }

  console.log("API HIT CONFIRMED");

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
