import { PrismaClient } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export function getPrisma() {
  return prisma;
}

export interface GenericAPIParams {
  req: NextApiRequest;
  res: NextApiResponse;
  prisma: typeof prisma;
}

export const json = (param: any): any => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
  );
};

export async function runMain(
  main: (params: GenericAPIParams) => Promise<any>,
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  await main({
    req,
    prisma,
    res,
  });
  await prisma.$disconnect();
}
