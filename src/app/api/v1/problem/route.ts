import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { GenericAPIParams, json } from "@/utils/api";
import { ProblemType } from "@/types";
import { getAuthUser } from "@/libs/next-auth/helper";
import { validateFormProblem } from "@/utils";
import { NextRequest } from "next/server";

export async function PATCH(req: NextRequest) {
  let errors: Record<string, string> = {};
  let response: Response | undefined;

  try {
    const body = await req.json();
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

    response = Response.json("success");
  } catch (e) {
    console.log(e);
    response = new Response("fail", {
      status: 500,
    });
  }
  await prisma.$disconnect();

  return response;
}

export async function POST(req: NextRequest) {
  let errors: Record<string, string> = {};
  let response: Response | undefined;

  try {
    const user = await getAuthUser();
    if (!user) throw Error("not allowed");

    const body = await req.json();
    const { answer, statement, subTopicId, title, topicId, type } =
      body as unknown as ProblemType;

    errors = validateFormProblem(body);

    if (Object.keys(errors).length > 0) {
      throw errors;
    }

    const problem = await prisma.problem.create({
      data: {
        authorId: user.id,
        title,
        type,
        answer,
        statement,
        topicId,
        subTopicId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });

    response = Response.json(
      JSON.parse(json({ message: "success", id: problem.id }))
    );
  } catch (e) {
    console.log(e);
    response = Response.json(
      {
        message: "fail",
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
  let response: Response | undefined;

  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    const user = await getAuthUser();
    console.log(user);

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

      response = Response.json(JSON.parse(json(problem)));
    } else {
      throw Error("id undefined");
    }
  } catch (e) {
    console.log(e);
    response = Response.json(
      {
        message: "fail",
      },
      {
        status: 500,
      }
    );
  }
  await prisma.$disconnect();
  return response;
}

export async function DELETE(req: NextRequest) {
  let response: Response | undefined;

  try {
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    const user = await getAuthUser();

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

      response = Response.json({
        message: "success",
      });
    } else {
      throw Error("id undefined");
    }
  } catch (e) {
    console.log(e);
    response = Response.json(
      {
        message: "fail",
      },
      {
        status: 500,
      }
    );
  }

  await prisma.$disconnect();
  return response;
}
