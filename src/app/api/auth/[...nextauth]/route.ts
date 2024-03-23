import NextAuth from "next-auth";
import { authConfig } from "@/libs/next-auth/authConfig";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
