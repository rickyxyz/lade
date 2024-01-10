import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authConfig } from "./authConfig";
import { UserType } from "@/types";

export async function getAuthUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authConfig);

  if (!session) return null;

  return session.user as UserType;
}
