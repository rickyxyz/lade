// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/libs/prisma";
import { API_FAIL_MESSAGE } from "@/consts/api";
import { NextResponse } from "next/server";

export async function POST() {
  let response = NextResponse.json(
    {
      message: API_FAIL_MESSAGE,
    },
    {
      status: 500,
    }
  );

  try {
    await prisma.solved.deleteMany({});
    await prisma.problem.deleteMany({});

    response = NextResponse.json({
      message: "ok",
    });
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  return response;
}
