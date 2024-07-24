import { API_MESSAGE, ApiMessageCode } from "@/consts/api";
import axios from "axios";
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_PATH,
  timeout: 10 * 1000,
});

export interface GenericAPIParams {
  req: NextApiRequest;
  res: NextApiResponse;
  prisma?: typeof prisma;
}

export const json = (param: unknown) => {
  return JSON.stringify(
    param,
    (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
  );
};

export function entryObject<K extends string>(
  object: URLSearchParams,
  keys: K[]
) {
  return keys.reduce(
    (prev, key) => ({
      ...prev,
      [key]: object.get(key),
    }),
    {}
  ) as Record<K, string>;
}

export function responseTemplate(status: number) {
  const message = API_MESSAGE[status] ?? "";

  return NextResponse.json(
    {
      message,
    },
    {
      status,
    }
  );
}
