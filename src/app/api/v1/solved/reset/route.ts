// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";

export async function POST() {
  let result = Response.json(
    {
      message: "fail",
    },
    {
      status: 500,
    }
  );
  try {
    await prisma.solved.deleteMany({});
    result = Response.json({
      message: "ok",
    });
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  return result;
}
