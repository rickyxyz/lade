/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  type UserCredential,
} from "firebase/auth";
import { auth } from "../config";
import { crudData } from "./getterSetter";
import { SignUpFormType } from "@/types";
import { signOut as signOutNextAuth } from "next-auth/react";

export function getErrorMessage(code: any) {
  switch (code) {
    case "auth/email-already-in-use":
      return { type: "email", message: "This email is already in use!" };
    case "auth/invalid-email":
      return { type: "email", message: "This email is invalid!" };
    case "auth/user-not-found":
      return { type: "email", message: "This account does not exist." };
    case "auth/wrong-password":
      return { type: "password", message: "Wrong password." };
    default:
      return {
        type: "generic",
        message: "Something went wrong. Please try again later.",
      };
  }
}

export interface loginParams {
  email: string;
  password: string;
  onSuccess?: (cred: UserCredential) => void;
  onFail?: (error: unknown) => void;
}

export interface SignUpParams {
  data: SignUpFormType;
  onSuccess?: (cred: UserCredential) => void;
  onFail?: (error: unknown) => void;
}

export async function login({
  email,
  password,
}: loginParams): Promise<UserCredential> {
  return signInWithEmailAndPassword(auth, email, password);
}

export async function signUp(data: SignUpFormType) {
  const { email, username, password } = data;
  const now = new Date().getTime();

  return createUserWithEmailAndPassword(auth, email, password).then(
    async (cred) => {
      const id = cred.user.uid;
      await crudData("set_user", {
        data: {
          username,
          joinDate: now,
        } as any,
        id,
      });
      return cred;
    }
  );
}

export async function logout() {
  setTimeout(async () => {
    await signOut(auth).then(() => {
      signOutNextAuth({
        redirect: false,
      });
    });
  }, 300);
}
