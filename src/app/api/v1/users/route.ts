// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { prisma } from "@/libs/prisma";
import { json } from "@/utils/api";
import { UserType } from "@/types";
import { API_FAIL_MESSAGE } from "@/consts/api";
import { NextResponse } from "next/server";

export async function GET() {
  let result: UserType[] | undefined;
  try {
    const problems = await prisma.user.findMany({});
    result = JSON.parse(json(problems));
  } catch (e) {
    result = undefined;
  }

  await prisma.$disconnect();

  if (result) {
    return NextResponse.json(result);
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
