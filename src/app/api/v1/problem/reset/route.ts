// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";

export default async function POST() {
  let response = Response.json(
    {
      message: "fail",
    },
    {
      status: 500,
    }
  );

  try {
    await prisma.solved.deleteMany({});
    await prisma.problem.deleteMany({});

    response = Response.json({
      message: "ok",
    });
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  return response;
}
