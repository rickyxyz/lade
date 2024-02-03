import { authConfig } from "@/libs/next-auth";
import { getServerSession } from "next-auth/next";

export default async function haha(req, res) {
  const session = await getServerSession(req, res, authConfig);
  if (session) {
    // Signed in
    console.log("Session", JSON.stringify(session, null, 2));
  } else {
    // Not Signed in
    res.status(401);
  }
  res.end();
}
