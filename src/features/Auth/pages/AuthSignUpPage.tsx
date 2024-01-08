import { useCallback, useMemo } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { signUp } from "@/libs/firebase";
import { Button, Card } from "@/components";
import { validateFormSignUp } from "@/utils";
import { SignUpFormType } from "@/types";
import { AuthHeader } from "../components/AuthHeader";
import { AuthInput } from "../components/AuthInput";
import { PageTemplate } from "@/templates";
import { signIn } from "next-auth/react";
import { api } from "@/utils/api";
import { useAppDispatch } from "@/libs/redux";

export function AuthSignUpPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleSignUp = useCallback(
    async (values: SignUpFormType, actions: FormikHelpers<SignUpFormType>) => {
      const now = new Date().toUTCString();
      const { email, username } = values;

      await signUp(values)
        .then((credential) => ({
          credential,
          idToken: credential.user.getIdToken(true),
        }))
        .then(({ idToken, credential }) => {
          signIn("credentials", {
            idToken,
            redirect: false,
          });

          return credential;
        })
        .then(({ user: { uid } }) =>
          api.post("/user", {
            id: username,
            uid,
            email,
            joinDate: now,
          })
        )
        .then(() => {
          router.push("/");
        })
        .catch((e) => {
          console.log(e);
          console.log("Register Error");
          actions.setSubmitting(false);
        });
    },
    [router]
  );

  const renderForm = useMemo(
    () => (
      <Card className="w-80 mx-auto">
        <AuthHeader
          title="Sign Up"
          subtitle={
            <>
              Already have an account?
              <br />
              <Link href="/login">Login</Link> instead.
            </>
          }
        />
        <Formik
          initialValues={{
            email: "",
            username: "",
            password: "",
          }}
          validate={validateFormSignUp}
          onSubmit={handleSignUp}
        >
          {({ isSubmitting }) => (
            <Form>
              <AuthInput name="email" type="email" label="Email" />
              <AuthInput name="username" type="text" label="Username" />
              <AuthInput name="password" type="password" label="Password" />
              <Button
                className="w-full mt-8"
                type="submit"
                loading={isSubmitting}
              >
                Sign Up
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    ),
    [handleSignUp]
  );

  return <PageTemplate hideSidebar>{renderForm}</PageTemplate>;
}
