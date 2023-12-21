// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

const json = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
  );
};

async function main() {
  // ... you will write your Prisma Client queries here
  await prisma.topic.create({
    data: {
      id: 1,
      name: "Calculus",
    },
  });
  // await prisma.user.deleteMany({});

  const allUsers = await prisma.topic.findMany();

  return json(allUsers);
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  main()
    .then(async (result) => {
      await prisma.$disconnect();
      console.log(JSON.parse(result));
      res.status(200).json(JSON.parse(result));
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      res.status(400).json(e);
    });
}
