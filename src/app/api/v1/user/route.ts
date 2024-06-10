// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GenericAPIParams, json } from "@/utils/api";
import { prisma } from "@/libs/prisma";
import { ProblemTopicType, UserType } from "@/types";
import { NextRequest, NextResponse } from "next/server";
import { API_FAIL_MESSAGE } from "@/consts/api";

export async function POST(req: NextRequest) {
  let response = NextResponse.json(
    {
      message: API_FAIL_MESSAGE,
    },
    {
      status: 500,
    }
  );

  try {
    const body = await req.json();

    const { id, uid, name, email } = body as unknown as UserType;

    await prisma.user.create({
      data: {
        id,
        uid,
        name,
        email,
        role: "USER",
        joinDate: new Date(),
      },
    });

    response = NextResponse.json({ message: "success" });
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  return response;
}

export async function GET(req: NextRequest) {
  let response = NextResponse.json(
    {
      message: API_FAIL_MESSAGE,
    },
    {
      status: 500,
    }
  );

  try {
    const searchParams = req.nextUrl.searchParams;
    const uid = searchParams.get("uid");
    const id = searchParams.get("id");

    if (typeof uid === "string") {
      const out = await prisma.user.findUnique({
        where: {
          uid,
        },
      });

      response = NextResponse.json(JSON.parse(json(out)));
    } else if (typeof id === "string") {
      const out = await prisma.user.findUnique({
        where: {
          id,
        },
      });

      response = NextResponse.json(JSON.parse(json(out)));
    }
    {
      throw Error("uid undefined");
    }
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  return response;
}
