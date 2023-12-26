// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getPrisma, json } from "@/utils/api";
import { ProblemType } from "@/types";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const prisma = getPrisma();
  const { method } = req;

  if (method !== "GET") {
    res.status(500).json({
      error: "internal server error",
    });
    return;
  }

  let result: ProblemType[] | undefined;
  try {
    const problems = await prisma.problem.findMany();
    result = JSON.parse(json(problems));
  } catch (e) {
    result = undefined;
  }

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({
      error: "internal server error",
    });
  }

  await prisma.$disconnect();
}
