// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GenericAPIParams, json } from "@/utils/api";
import { prisma } from "@/libs/prisma";
import { ProblemTopicType, UserType } from "@/types";
import { NextRequest } from "next/server";
import { API_FAIL_MESSAGE } from "@/consts/api";

export async function POST(req: NextRequest) {
  let response = Response.json(
    {
      message: API_FAIL_MESSAGE,
    },
    {
      status: 500,
    }
  );

  try {
    const body = await req.json();

    const { id, uid, email } = body as unknown as UserType;

    await prisma.user.create({
      data: {
        id,
        uid,
        email,
        role: "USER",
        joinDate: new Date(),
      },
    });

    response = Response.json({ message: "success" });
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  return response;
}

export async function GET(req: NextRequest) {
  let response = Response.json(
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

    if (typeof uid === "string") {
      const out = await prisma.user.findUnique({
        where: {
          uid,
        },
      });

      response = Response.json(JSON.parse(json(out)));
    } else {
      throw Error("uid undefined");
    }
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();
  return response;
}
