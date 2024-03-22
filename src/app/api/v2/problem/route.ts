import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { GenericAPIParams, json } from "@/utils/api";
import { ProblemType } from "@/types";
import { getAuthUserNext } from "@/libs/next-auth/helper";
import { validateFormProblem } from "@/utils";
import { NextRequest } from "next/server";
import { API_FAIL_MESSAGE } from "@/consts/api";

export async function POST(req: NextRequest) {
  let errors: Record<string, string> = {};
  let response: Response | undefined;

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

    response = Response.json(JSON.parse(json({ message: "success" })));
  } catch (e) {
    console.log(e);
    response = Response.json(
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
