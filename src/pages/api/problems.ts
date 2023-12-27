// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma, json } from "@/utils/api";
import { ProblemType } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;

  if (method !== "GET") {
    res.status(405).json({
      message: "fail",
    });
    return;
  }

  let result: ProblemType[] | undefined;
  try {
    const problems = await prisma.problem.findMany({
      include: {
        topic: true,
        subtopic: true,
      },
    });
    result = JSON.parse(json(problems));
  } catch (e) {
    result = undefined;
  }

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({
      message: "fail",
    });
  }

  await prisma.$disconnect();
}
