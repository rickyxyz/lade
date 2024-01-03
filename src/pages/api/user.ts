// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { GenericAPIParams, json } from "@/utils/api";
import { prisma } from "@/libs/prisma";
import { ProblemTopicType, UserType } from "@/types";

async function POST({ req, res }: GenericAPIParams) {
  const { body, method } = req;

  try {
    const { id, email, joinDate } = body as unknown as UserType;

    await prisma.user.create({
      data: {
        id,
        email,
        role: "USER",
        joinDate: new Date(joinDate),
      },
    });

    res.status(200).json({ message: "success" });
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "fail",
    });
  }
}

async function GET({ req, res }: GenericAPIParams) {
  try {
    const {
      query: { email },
    } = req;

    if (typeof email === "string") {
      const out = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      res.status(200).json(JSON.parse(json(out)));
    } else {
      throw Error("email undefined");
    }
  } catch (e) {
    console.log(e);
    res.status(500).json({
      message: "fail",
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;

  switch (method) {
    case "GET":
      await GET({
        req,
        res,
      });
      break;
    case "POST":
      await POST({
        req,
        res,
      });
      break;
    default:
      res.status(405).json({ message: "fail" });
      break;
  }

  await prisma.$disconnect();
}
