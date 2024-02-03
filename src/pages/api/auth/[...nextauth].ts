import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { async } from "@firebase/util";
import { authConfig } from "@/libs/next-auth/authConfig";

// For more information on each option (and a full list of options) go to
// https://next-auth.js.org/configuration/options
export default NextAuth(authConfig);
