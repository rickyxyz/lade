// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { GenericAPIParams, json } from "@/utils/api";
import { ProblemType } from "@/types";
import { getAuthUser } from "@/libs/next-auth/helper";
import { validateFormProblem } from "@/utils";
import { API_FAIL_MESSAGE } from "@/consts/api";

async function PATCH({ req, res }: GenericAPIParams) {
  let errors: Record<string, string> = {};

  try {
    const { body } = req;
    const {
      answer,
      statement,
      subTopicId,
      title,
      topicId,
      type,
      id,
      authorId,
    } = body as unknown as ProblemType;

    errors = validateFormProblem(body);

    if (Object.keys(errors).length > 0) {
      throw errors;
    }

    await prisma.problem.update({
      where: {
        id: id as number,
      },
      data: {
        title,
        statement,
        answer,
        authorId,
        topicId,
        subTopicId,
        type,
        updatedAt: new Date(),
      },
    });

    res.status(200).json({ message: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: API_FAIL_MESSAGE,
      ...(Object.keys(errors).length > 0 ? { errors } : {}),
    });
  }
}

async function POST({ req, res }: GenericAPIParams) {
  let errors: Record<string, Record<string, string>> = {};

  try {
    const user = await getAuthUser(req, res);

    if (!user) throw Error("not allowed");

    const { body } = req;

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

    res.status(200).json(JSON.parse(json({ message: "success" })));
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: API_FAIL_MESSAGE,
      ...(Object.keys(errors).length > 0 ? { errors } : {}),
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
      const rawProblem = await prisma.problem.findUnique({
        where: {
          id: id as unknown as number,
        },
        include: {
          solveds: true,
          topic: true,
          subTopic: true,
        },
      });

      if (!rawProblem) throw Error("not found");

      const problem = { ...rawProblem } as unknown as ProblemType;

      if (!user || (problem.authorId !== user.id && user.role !== "admin")) {
        problem.answer = JSON.stringify({});
      }

      res.status(200).json(JSON.parse(json(problem)));
    } else {
      throw Error("id undefined");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: API_FAIL_MESSAGE,
    });
  }
}

async function DELETE({ req, res }: GenericAPIParams) {
  try {
    const {
      query: { id },
    } = req;

    const user = await getAuthUser(req, res);

    if (typeof id === "number") {
      const out = await prisma.problem.findUnique({
        where: {
          id,
        },
        include: {
          solveds: true,
          topic: true,
          subTopic: true,
        },
      });

      const temp = { ...out } as unknown as ProblemType;

      const allowDelete =
        user && (user.id === temp.authorId || user.role === "admin");

      if (!allowDelete) {
        throw Error("unauthorized");
      }

      await prisma.problem.delete({
        where: {
          id,
        },
      });

      res.status(200).json({
        message: "success",
      });
    } else {
      throw Error("id undefined");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: API_FAIL_MESSAGE,
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
      res.status(405).json({ message: API_FAIL_MESSAGE });
      break;
  }

  await prisma.$disconnect();
}
