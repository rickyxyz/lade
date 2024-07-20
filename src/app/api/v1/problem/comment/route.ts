// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/libs/prisma";
import { entryObject, json } from "@/utils/api";
import { ApiPagination, ProblemType } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { API_FAIL_MESSAGE } from "@/consts/api";
import { validateFormProblem } from "@/utils";
import { CommentDatabaseType, CommentType } from "@/types/comment";

export async function GET(req: NextRequest) {
  const user = await getAuthUserNext();
  const searchParams = req.nextUrl.searchParams;

  let result:
    | {
        data: CommentType[];
        pagination: ApiPagination;
      }
    | undefined;

  try {
    const problemId = searchParams.get("problemId");
    const commentId = searchParams.get("commentId");
    const parPage = searchParams.get("page");
    const parCount = searchParams.get("count");
    let { sort, sortBy } = entryObject(searchParams, ["sort", "sortBy"]);

    let page = parPage as unknown as number;
    page = Number(parPage);
    if (isNaN(page)) page = 1;

    let count = parCount as unknown as number;
    count = Number(parCount);
    if (isNaN(count)) count = 4;

    if (count >= 10) count = 10;
    else if (count <= 0) count = 5;

    if (!sort) sort = "createdAt";
    if (!sortBy) sortBy = "desc";

    console.log("Sort: ", sort);
    console.log("Sort: ", sortBy);

    const commentCount = await prisma.comment.count({
      where: {
        problemId: problemId as any,
        parentId: commentId as any,
        deletedAt: null,
      },
    });
    const maxPages = Math.ceil(commentCount / count);

    if (page > maxPages) page = maxPages;
    if (page < 1) page = 1;

    const comments = (await prisma.comment.findMany({
      where: {
        problemId: problemId as any,
        parentId: commentId as any,
        deletedAt: null,
      },
      include: {
        _count: {
          select: { children: true },
        },
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        [sort]: sortBy,
      },
      skip: (Number(page) - 1) * Number(count),
      take: Number(count),
    })) as unknown as CommentDatabaseType[];

    const converted = comments.map((comment) => {
      const count = comment._count.children;
      const { createdAt, updatedAt, id, description, author } = comment;
      return {
        createdAt,
        updatedAt,
        id,
        description,
        author,
        replyCount: count,
      };
    }) as CommentType[];

    result = {
      data: JSON.parse(json(converted)),
      pagination: {
        total_records: commentCount,
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
  let response: NextResponse | undefined;

  try {
    const user = await getAuthUserNext();
    if (!user) throw Error("not allowed");

    const body = await req.json();
    const { problemId, commentId, comment } = body as unknown as {
      problemId: string;
      commentId?: string;
      comment: string;
    };
    console.log("USER: ", user.id);
    console.log(body);

    let parentExists = false;
    if (commentId) {
      const parent = await prisma.comment.findFirst({
        where: {
          children: {
            some: {
              id: commentId as any,
            },
          },
        },
      });

      parentExists = !!parent;
    }

    if (parentExists) {
      throw Error("not allowed");
    }

    const result = await prisma.comment.create({
      data: {
        problem: {
          connect: {
            id: problemId as any,
          },
        },
        author: {
          connect: {
            id: user.id as any,
          },
        },
        description: comment,
        ...(commentId
          ? {
              parent: {
                connect: {
                  id: commentId as any,
                },
              },
            }
          : {}),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    response = NextResponse.json(
      JSON.parse(json({ data: result, message: "success" }))
    );
  } catch (e) {
    console.log(e);
    response = NextResponse.json(
      {
        message: API_FAIL_MESSAGE,
      },
      {
        status: 500,
      }
    );
  }

  await prisma.$disconnect();
  return response;
}

export async function PATCH(req: NextRequest) {
  let response: NextResponse | undefined;

  try {
    const user = await getAuthUserNext();
    if (!user) throw Error("not allowed");

    const body = await req.json();
    const { commentId, comment } = body as unknown as {
      commentId: string;
      comment: string;
    };

    await prisma.comment.update({
      where: {
        id: commentId as any,
        authorId: user.id,
      },
      data: {
        description: comment,
      },
    });

    response = NextResponse.json(JSON.parse(json({ message: "success" })));
  } catch (e) {
    console.log(e);
    response = NextResponse.json(
      {
        message: API_FAIL_MESSAGE,
      },
      {
        status: 500,
      }
    );
  }

  await prisma.$disconnect();
  return response;
}
