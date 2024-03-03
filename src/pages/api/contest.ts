// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { GenericAPIParams, json } from "@/utils/api";
import {
  ContestDatabaseType,
  ContestType,
  ProblemContestType,
  ProblemDatabaseType,
  ProblemType,
} from "@/types";
import { getAuthUser } from "@/libs/next-auth/helper";

async function PATCH({ req, res }: GenericAPIParams) {
  try {
    const { body } = req;

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

    res.status(200).json({ message: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "fail",
    });
  }
}

async function POST({ req, res }: GenericAPIParams) {
  try {
    const user = await getAuthUser(req, res);

    // if (!user) throw Error("not allowed");

    const { body } = req;

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

    res
      .status(200)
      .json(JSON.parse(json({ message: "success", id: contest.id })));
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "fail",
    });
  }
}

async function GET({ req, res }: GenericAPIParams) {
  try {
    const {
      query: { id },
    } = req;

    const user = await getAuthUser(req, res);

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

      res.status(200).json(JSON.parse(json(contest)));
    } else {
      throw Error("id undefined");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "fail",
    });
  }
}

async function DELETE({ req, res }: GenericAPIParams) {
  try {
    const {
      query: { id },
    } = req;

    return await prisma.$transaction(async (tx) => {
      const user = await getAuthUser(req, res);

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

        res.status(200).json({
          message: "success",
        });
      } else {
        throw Error("id undefined");
      }
    });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "fail",
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      await GET({
        req,
        res,
      });
      break;
    case "POST":
      await POST({
        req,
        res,
      });
      break;
    case "PATCH":
      await PATCH({
        req,
        res,
      });
      break;
    case "DELETE":
      await DELETE({
        req,
        res,
      });
      break;
    default:
      res.status(405).json({ message: "fail" });
      break;
  }

  await prisma.$disconnect();
}
