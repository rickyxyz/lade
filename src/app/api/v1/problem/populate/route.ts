// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/libs/prisma";
import { PROBLEM_PLACEHOLDERS } from "@/libs/firebase/placeholders";

export async function POST() {
  let response = Response.json(
    {
      message: API_FAIL_MESSAGE,
    },
    {
      status: 500,
    }
  );
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

    response = Response.json({
      message: "ok",
    });
  } catch (e) {
    console.log(e);
  }

  await prisma.$disconnect();

  return response;
}
