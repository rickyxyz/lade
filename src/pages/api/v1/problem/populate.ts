// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { PROBLEM_PLACEHOLDERS } from "@/libs/firebase/placeholders";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const { method } = req;

  if (method !== "POST") {
    res.status(405).json({ message: "fail" });
    return;
  }

  try {
    // for (const problem of PROBLEM_PLACEHOLDERS) {
    //   const { answer, statement, subTopicId, title, topicId, type } = problem;

    //   await prisma.problem.create({
    //     data: {
    //       authorId: "admin",
    //       title,
    //       type,
    //       answer,
    //       statement,
    //       topicId,
    //       subTopicId,
    //       createdAt: new Date(),
    //     },
    //   });
    // }

    await prisma.user.upsert({
      where: {
        id: "admin",
      },
      update: {},
      create: {
        id: "admin",
        email: "admin@admin.com",
        role: "ADMIN",
        joinDate: new Date(),
        uid: "admin",
      },
    });

    await prisma.problem.createMany({
      data: PROBLEM_PLACEHOLDERS.map(
        ({ answer, statement, subTopicId, title, topicId, type }) => {
          return {
            authorId: "admin",
            title,
            type,
            answer,
            statement,
            topicId,
            subTopicId,
            createdAt: new Date(),
          };
        }
      ),
    });

    res.status(200).json(req.body);
  } catch (e) {
    console.log(e);
    res.status(500).json({
      error: "internal server error 2",
    });
  }

  await prisma.$disconnect();
}
