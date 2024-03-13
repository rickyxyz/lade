// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";

export async function POST() {
  let response = Response.json(
    {
      message: "fail",
    },
    {
      status: 500,
    }
  );

  try {
    await prisma.subtopic.deleteMany({});
    await prisma.topic.deleteMany({});

    response = Response.json({
      message: "ok",
    });
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  return response;
}