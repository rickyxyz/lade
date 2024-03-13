"use server";
import { getServerSession } from "next-auth";
import { authConfig } from "./authConfig";
import { UserType } from "@/types";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession as getServerSessionNext } from "next-auth/next";

export async function getAuthUser(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authConfig);
  if (!session) return null;
  return session.user as UserType;
}

export async function getAuthUserNext() {
  const session = await getServerSessionNext(authConfig);
  if (!session) return null;
  return session.user as UserType;
}
