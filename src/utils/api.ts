import { PrismaClient } from "@prisma/client";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_PATH,
  timeout: 5000,
});

export interface GenericAPIParams {
  req: NextApiRequest;
  res: NextApiResponse;
  prisma?: typeof prisma;
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
