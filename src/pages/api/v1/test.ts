// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { json } from "@/utils/api";
import { ContestDatabaseType, ProblemType } from "@/types";
import { getAuthUser } from "@/libs/next-auth/helper";
import { isNaN } from "formik";
import { API_FAIL_MESSAGE } from "@/consts/api";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;

  if (method !== "GET") {
    res.status(405).json({
      message: API_FAIL_MESSAGE,
    });
    return;
  }

  let result:
    | {
        data: ContestDatabaseType[];
      }
    | undefined;

  try {
    const {
      query: { id },
    } = req;

    if (!id) throw Error("no");

    const contests = await prisma.contestToProblem.findMany({
      where: {
        contestId: id as any,
      },
    });

    const parsedProblems = JSON.parse(json(contests));

    result = {
      data: parsedProblems,
    };

    console.log("Returning");
    console.log(result);
  } catch (e) {
    console.log(e);
    result = undefined;
  }

  console.log("API HIT CONFIRMED");

  if (result) {
    res.status(200).json(result);
  } else {
    res.status(500).json({
      message: API_FAIL_MESSAGE,
    });
  }

  await prisma.$disconnect();
}
