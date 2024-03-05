// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;

  if (method !== "POST") {
    res.status(500).json({
      message: "fail",
    });
    return;
  }

  try {
    await prisma.subtopic.deleteMany({});
    await prisma.topic.deleteMany({});

    res.status(200).json(req.body);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "fail",
    });
  }

  await prisma.$disconnect();
}
