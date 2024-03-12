import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { async } from "@firebase/util";
import { authConfig } from "@/libs/next-auth/authConfig";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export const handler = NextAuth(authConfig);

export { handler as GET, handler as POST };
