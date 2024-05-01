import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { GenericAPIParams, json } from "@/utils/api";
import { ProblemType } from "@/types";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { validateFormProblem } from "@/utils";
import { NextRequest, NextResponse } from "next/server";
import { API_FAIL_MESSAGE } from "@/consts/api";
import { firebase } from "@/libs/firebase-admin";

export async function PATCH(req: NextRequest) {
  let errors: Record<string, string> = {};
  let response = NextResponse.json(
    {
      message: "fail",
    },
    {
      status: 500,
    }
  );

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

    const docRef = firebase
      .firestore()
      .collection("problems")
      .doc(id as any);

    await prisma.$transaction(async (tx) => {
      const before = await tx.problem.findUnique({
        where: {
          id: id as unknown as number,
        },
      });

      if (!before) throw "";

      if (before.type !== type) {
        errors.type = "Problem type cannot be changed.";
        throw "";
      }

      if (before.answer !== answer) {
        await docRef.set(
          {
            answerLastUpdated: new Date().getTime(),
          },
          { merge: true }
        );
      }

      await tx.problem.update({
        where: {
          id: id as unknown as number,
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
  let response: Response | undefined;

  try {
    const user = await getAuthUserNext();
    if (!user) throw Error("not allowed");

    const body = await req.json();
    const { answer, statement, subTopicId, title, topicId, type } =
      body as unknown as ProblemType;

    errors = validateFormProblem(body);

    if (Object.keys(errors).length > 0) {
      throw "fail";
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

    response = NextResponse.json(
      JSON.parse(json({ message: "success", id: problem.id }))
    );
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
    const searchParams = req.nextUrl.searchParams;
    const id = searchParams.get("id");

    const user = await getAuthUserNext();
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

      response = NextResponse.json(JSON.parse(json(problem)));
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
  console.log("DELETE");
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

    const user = await getAuthUserNext();

    if (id) {
      const out = await prisma.problem.findUnique({
        where: {
          id: id as any,
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

      console.log("user: ", user);
      console.log("author: ", out);

      if (!allowDelete) {
        throw Error("unauthorized");
      }

      await prisma.problem.delete({
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
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  return response;
}
