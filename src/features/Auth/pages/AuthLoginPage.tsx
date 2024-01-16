import { useCallback, useMemo } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { login } from "@/libs/firebase";
import { Button, Card } from "@/components";
import { validateFormLogin } from "@/utils";
import { LoginFormType, UserType } from "@/types";
import { AuthHeader } from "../components/AuthHeader";
import { AuthInput } from "../components/AuthInput";
import { PageTemplate } from "@/templates";
import { signIn } from "next-auth/react";
import { useAppDispatch } from "@/libs/redux";
import { api } from "@/utils/api";
import { API } from "@/api";

export function AuthLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = useCallback(
    async (values: LoginFormType, actions: FormikHelpers<LoginFormType>) => {
      await login(values)
        .then((credential) => ({
          credential,
          idToken: credential.user.getIdToken(true),
        }))
        .then(({ credential, idToken }) => {
          signIn("credentials", {
            idToken,
            redirect: false,
          });
          return credential;
        })
        .then(({ user: { uid } }) =>
          API("get_user", {
            params: {
              uid,
            },
          })
        )
        .then((user) => {
          console.log("Fetched User: ");
          console.log(user.data);
          dispatch("update_user", user.data);
          router.push("/");
        })
        .catch((e) => {
          console.log(e);
          console.log("Login Error");
          actions.setSubmitting(false);
        });
    },
    [dispatch, router]
  );

  const renderForm = useMemo(
    () => (
      <Card className="w-80 mx-auto">
        <AuthHeader
          title="Login"
          subtitle={
            <>
              Don&apos;t have an account?
              <br />
              <Link href="/signup">Sign Up</Link> instead.
            </>
          }
        />
        <Formik
          initialValues={{
            email: "",
            password: "",
          }}
          validate={validateFormLogin}
          onSubmit={handleLogin}
        >
          {({ isSubmitting }) => (
            <Form>
              <AuthInput name="email" type="email" label="Email" />
              <AuthInput name="password" type="password" label="Password" />
              <Button
                className="w-full mt-8"
                type="submit"
                loading={isSubmitting}
              >
                Login
              </Button>
            </Form>
          )}
        </Formik>
      </Card>
    ),
    [handleLogin]
  );

  return <PageTemplate hideSidebar>{renderForm}</PageTemplate>;
}
