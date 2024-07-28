// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/libs/prisma";
import { entryObject, json, responseTemplate } from "@/utils/api";
import { ApiPagination } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { API_FAIL_MESSAGE } from "@/consts/api";
import { validateComment } from "@/utils";
import { CommentDatabaseType, CommentType } from "@/types/comment";

export async function GET(req: NextRequest) {
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

  /** await prisma.$disconnect(); */

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
  let response = responseTemplate(500);

  const user = await getAuthUserNext().catch(() => null);

  if (!user) {
    /** await prisma.$disconnect(); */
    return responseTemplate(401);
  }

  try {
    const body = await req.json();
    const { problemId, commentId, comment } = body as unknown as {
      problemId?: string;
      commentId?: string;
      comment?: string;
    };

    const commentError = validateComment(comment);

    if (!comment || !problemId) {
      return responseTemplate(400, {
        errors: {
          ...(commentError
            ? {
                comment: commentError,
              }
            : {}),
          ...(problemId
            ? {}
            : {
                problemId: "Problem ID is required.",
              }),
        },
      });
    }

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
      // throw Error("not allowed");
      return responseTemplate(400, {
        errors: {
          commentId:
            "Parent comment must not be a reply to another parent comment.",
        },
      });
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

    response = responseTemplate(200, {
      ...JSON.parse(json({ data: result })),
    });
    // response = NextResponse.json(
    //   JSON.parse(json({ data: result, message: "success" }))
    // );
  } catch (e) {
    console.log(e);
    response = responseTemplate(500);
  }

  /** await prisma.$disconnect(); */
  return response;
}

export async function PATCH(req: NextRequest) {
  let response = responseTemplate(500);

  const user = await getAuthUserNext().catch(() => null);

  if (!user) {
    /** await prisma.$disconnect(); */
    return responseTemplate(401);
  }

  try {
    const body = await req.json();
    const { commentId, comment } = body as unknown as {
      commentId?: string;
      comment?: string;
    };

    let code = 500;
    let error = comment ? validateComment(comment) : null;

    if (error) {
      code = 400;
    }

    const results =
      commentId && comment && error === null
        ? await prisma.comment.updateMany({
            where: {
              id: commentId as any,
              // authorId: user?.id,
              description: {
                not: comment,
              },
            },
            data: {
              description: comment,
            },
          })
        : null;

    if (error === null) {
      if (results && results.count === 1) {
        code = 201;
      } else {
        const existingComment = await prisma.comment.findUnique({
          where: { id: commentId as any },
        });
        if (!existingComment) {
          code = 404;
        } else if (!user || existingComment.authorId !== user.id) {
          code = 403;
        } else if (existingComment.description === comment) {
          code = 400;
          error = "Comment is the same.";
        }
      }
    }

    response = responseTemplate(
      code,
      error
        ? {
            error,
          }
        : {}
    );
  } catch (e) {
    console.log(e);
    response = responseTemplate(500);
  }

  /** await prisma.$disconnect(); */
  return response;
}
