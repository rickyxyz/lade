import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

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

export async function api(
  main: (req: NextApiRequest) => Promise<any>,
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  main(req)
    .then(async (result) => {
      console.log(JSON.parse(result));
      await prisma.$disconnect();
      res.status(200).json(JSON.parse(json(result)));
    })
    .catch(async (e) => {
      console.error(e);
      await prisma.$disconnect();
      res.status(400).json(e);
    });
}
