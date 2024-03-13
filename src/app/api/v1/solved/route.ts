// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { json } from "@/utils/api";
import { prisma } from "@/libs/prisma";
import { ProblemTopicType } from "@/types";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  let result: any;

  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");
    const problemId = searchParams.get("problemId");

    if (!userId || !problemId) throw Error("fail");

    result = await prisma.solved.findFirst({
      where: {
        userId: userId as any,
        problemId: problemId as any,
      },
    });
  } catch (e) {
    result = undefined;
  }

  await prisma.$disconnect();

  if (result !== undefined) {
    return Response.json(JSON.parse(json(result)));
  } else {
    return Response.json(
      {
        message: "fail",
      },
      {
        status: 500,
      }
    );
  }
}
