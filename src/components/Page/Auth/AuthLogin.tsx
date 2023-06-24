import { useCallback, useMemo } from "react";
import { Form, Formik, FormikHelpers } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import { login } from "@/firebase";
import { Button, Card, GenericPageTemplate } from "@/components";
import { validateFormLogin } from "@/utils";
import { LoginFormType } from "@/types";
import { AuthHeader } from "./AuthHeader";
import { AuthInput } from "./AuthInput";

export function AuthLogin() {
  const router = useRouter();

  const handleLogin = useCallback(
    async (values: LoginFormType, actions: FormikHelpers<LoginFormType>) => {
      await login(values)
        .then(() => {
          console.log("Login OK!!");
          router.push("/");
        })
        .catch((e) => {
          console.log(e);
          console.log("Login Error");
          actions.setSubmitting(false);
        });
    },
    [router]
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

  return <GenericPageTemplate hideSidebar>{renderForm}</GenericPageTemplate>;
}
