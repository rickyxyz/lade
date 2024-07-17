// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/libs/prisma";
import { entryObject, json } from "@/utils/api";
import { ApiPagination, ProblemType } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { API_FAIL_MESSAGE } from "@/consts/api";
import { validateFormProblem } from "@/utils";

export async function GET(req: NextRequest) {
  const user = await getAuthUserNext();
  const searchParams = req.nextUrl.searchParams;

  let result:
    | {
        data: ProblemType[];
        pagination: ApiPagination;
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
    if (isNaN(count)) count = 4;

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
        const object = {
          title: {
            contains: search,
            mode: "insensitive",
          },
        };
        return object;
      }
      return {};
    })();

    const problemCount = await prisma.problem.count({
      where: {
        ...topicQuery,
        ...subTopicQuery,
        ...searchQuery,
        deletedAt: null,
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
        ...topicQuery,
        ...subTopicQuery,
        ...searchQuery,
        deletedAt: null,
      },
      orderBy: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
    return NextResponse.json(result);
  } else {
    return NextResponse.json({
      message: API_FAIL_MESSAGE,
    });
  }
}

export async function POST(req: NextRequest) {
  let errors: Record<string, string> = {};
  let response: NextResponse | undefined;

  try {
    const user = await getAuthUserNext();
    if (!user) throw Error("not allowed");

    const body = await req.json();
    const problems = body as unknown as ProblemType[];

    errors = problems
      .map((problem, index) => [index, validateFormProblem(problem)])
      .filter(([, error]) => Object.keys(error).length > 0)
      .reduce(
        (prev, [id, error]) => ({
          ...prev,
          [id as number]: error,
        }),
        {}
      );

    if (Object.keys(errors).length > 0) {
      throw errors;
    }

    await prisma.problem.createMany({
      data: problems.map((problem) => ({
        ...problem,
        id: undefined,
        solveds: undefined,
        authorId: user.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })),
    });

    response = NextResponse.json(JSON.parse(json({ message: "success" })));
  } catch (e) {
    console.log(e);
    response = NextResponse.json(
      {
        message: API_FAIL_MESSAGE,
        ...(Object.keys(errors).length > 0 ? { errors } : {}),
      },
      {
        status: 500,
      }
    );
  }

  await prisma.$disconnect();
  return response;
}
