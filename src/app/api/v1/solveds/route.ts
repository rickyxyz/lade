// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { json } from "@/utils/api";
import { prisma } from "@/libs/prisma";
import { NextRequest } from "next/server";

export default async function handler(req: NextRequest) {
  let result: any;

  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId");

    if (!userId) throw Error("fail");

    result = await prisma.solved.findMany({
      where: {
        userId: userId as any,
      },
    });
  } catch (e) {
    result = undefined;
  }

  await prisma.$disconnect();

  if (result) {
    return Response.json(JSON.parse(json(result)));
  } else {
    return Response.json(
      {
        message: "fail",
      },
      {
        status: 500,
      }
    );
  }
}
