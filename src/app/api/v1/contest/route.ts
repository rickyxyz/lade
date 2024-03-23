// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/libs/prisma";
import { json } from "@/utils/api";
import { ContestDatabaseType, ContestType, ProblemContestType } from "@/types";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { validateFormContest } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import { API_FAIL_MESSAGE } from "@/consts/api";

export async function PATCH(req: NextRequest) {
  let errors: Record<string, string> = {};
  let response = NextResponse.json(
    {
      message: API_FAIL_MESSAGE,
    },
    {
      status: 500,
    }
  );

  try {
    const body = await req.json();

    const {
      id,
      subTopicId,
      title,
      topicId,
      description,
      problems,
      authorId,
      startDate,
      endDate,
      createdAt,
      updatedAt,
    } = body as unknown as ContestType;

    await prisma.$transaction(async (tx) => {
      await tx.contestToProblem.findMany({
        where: {
          contestId: id as any,
        },
      });

      const convertedProblems = Object.values(JSON.parse(problems)).map(
        (entry, index) => {
          const {
            problem: { id: pid },
            score,
          } = entry as ProblemContestType;
          return {
            problem: {
              connect: {
                id: pid,
              },
            },
            score,
            order: index,
          };
        }
      );

      errors = validateFormContest(body);

      if (Object.keys(errors).length > 0) {
        throw errors;
      }

      await tx.contestToProblem.deleteMany({
        where: {
          contestId: id as any,
        },
      });

      await tx.contest.update({
        where: {
          id: id as any,
        },
        data: {
          authorId,
          title,
          description,
          topicId,
          subTopicId,
          updatedAt: new Date(),
          ...(startDate ? { startDate: new Date(startDate) } : {}),
          ...(endDate ? { endDate: new Date(endDate) } : {}),
          toProblems: {
            create: convertedProblems as any,
          },
        },
      });
    });

    response = NextResponse.json({
      message: "success",
    });
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

export async function POST(req: NextRequest) {
  let errors: Record<string, string> = {};
  let response = NextResponse.json(
    {
      message: API_FAIL_MESSAGE,
    },
    {
      status: 500,
    }
  );

  try {
    const user = await getAuthUserNext();

    if (!user) throw Error("not allowed");

    const body = await req.json();

    const {
      subTopicId,
      title,
      topicId,
      description,
      problems,
      authorId,
      startDate,
      endDate,
    } = body as unknown as ContestType;

    const convertedProblems = Object.values(JSON.parse(problems)).map(
      (entry, index) => {
        const {
          problem: { id },
          score,
        } = entry as ProblemContestType;
        return {
          problem: {
            connect: {
              id,
            },
          },
          score,
          order: index,
        };
      }
    );

    errors = validateFormContest(body);

    if (Object.keys(errors).length > 0) {
      throw errors;
    }

    const contest = await prisma.contest.create({
      data: {
        authorId,
        title,
        description,
        topicId,
        subTopicId,
        createdAt: new Date(),
        updatedAt: new Date(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        toProblems: {
          create: convertedProblems as any,
        },
      },
    });

    response = NextResponse.json(
      JSON.parse(json({ message: "success", id: contest.id }))
    );
  } catch (e) {
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

export async function GET(req: NextRequest) {
  let response = NextResponse.json(
    {
      message: API_FAIL_MESSAGE,
    },
    {
      status: 500,
    }
  );

  try {
    const { id } = await req.json();

    const user = await getAuthUserNext();

    if (typeof id !== "undefined") {
      const rawContest = await prisma.contest.findUnique({
        where: {
          id: id as unknown as number,
        },
        include: {
          toProblems: {
            // include: {
            //   problem: true,
            // },
            select: {
              problem: true,
              score: true,
              order: true,
            },
          },
          topic: true,
          subTopic: true,
        },
      });

      if (!rawContest) throw Error("");

      const contest = { ...(rawContest as unknown as ContestDatabaseType) };
      contest.toProblems ??= [];
      contest.problems = contest.toProblems.length;
      contest.problemsData = contest.toProblems;
      delete contest.toProblems;

      if (!user || (contest.authorId !== user.id && user.role !== "admin")) {
        contest.problemsData = contest.problemsData.map((entry) => ({
          ...entry,
          problem: {
            ...entry.problem,
            answer: "{}",
          },
        }));
      }

      response = NextResponse.json(JSON.parse(json(contest)));
    } else {
      throw Error("id undefined");
    }
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  return response;
}

export async function DELETE(req: NextRequest) {
  let response = NextResponse.json(
    {
      message: API_FAIL_MESSAGE,
    },
    {
      status: 500,
    }
  );
  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    return await prisma.$transaction(async (tx) => {
      const user = await getAuthUserNext();

      if (id !== undefined) {
        const rawContest = await tx.contest.findUnique({
          where: {
            id: id as any,
          },
        });

        const contest = { ...rawContest } as unknown as ContestType;

        const allowDelete =
          user && (user.id === contest.authorId || user.role === "admin");

        if (!allowDelete) {
          throw Error("unauthorized");
        }

        await tx.contestToProblem.deleteMany({
          where: {
            contestId: id as any,
          },
        });

        await tx.contest.delete({
          where: {
            id: id as any,
          },
        });

        response = NextResponse.json({
          message: "success",
        });
      } else {
        throw Error("id undefined");
      }
    });
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  return response;
}
