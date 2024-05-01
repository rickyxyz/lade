// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { json } from "@/utils/api";
import { prisma } from "@/libs/prisma";
import { NextRequest, NextResponse } from "next/server";
import { API_FAIL_MESSAGE } from "@/consts/api";

export async function POST(req: NextRequest) {
  let result: any;

  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) throw Error("fail");

    result = await prisma.solved.findMany({
      where: {
        userId,
      },
    });
  } catch (e) {
    result = undefined;
  }

  await prisma.$disconnect();

  if (result) {
    return NextResponse.json(JSON.parse(json(result)));
  } else {
    return NextResponse.json(
      {
        message: API_FAIL_MESSAGE,
      },
      {
        status: 500,
      }
    );
  }
}
