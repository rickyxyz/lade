// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { getPrisma } from "@/utils/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const prisma = getPrisma();
  const { method } = req;

  if (method !== "POST") {
    res.status(500).json({
      error: "internal server error",
    });
    return;
  }

  try {
    await prisma.problem.deleteMany({});

    res.status(200).json(req.body);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "internal server error",
    });
  }

  await prisma.$disconnect();
}
