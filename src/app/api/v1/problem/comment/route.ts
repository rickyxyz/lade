// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/libs/prisma";
import { entryObject, json } from "@/utils/api";
import { ProblemType } from "@/types";
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
        data: any;
      }
    | undefined;

  try {
    const problemId = searchParams.get("problemId");
    const commentId = searchParams.get("commentId");

    const comments = (await prisma.comment.findMany({
      where: {
        problemId: problemId as any,
        parentId: commentId as any,
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
        createdAt: "desc",
      },
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

    result = JSON.parse(
      json({
        data: converted,
      })
    );

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

    const parent = await prisma.comment.findFirst({
      where: {
        children: {
          some: {
            id: commentId as any,
          },
        },
      },
    });

    if (parent) {
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
