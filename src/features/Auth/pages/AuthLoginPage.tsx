import { useCallback, useMemo } from "react";
import { signIn } from "next-auth/react";
import { Form, Formik, FormikHelpers } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API } from "@/api";
import { login } from "@/libs/firebase";
import { useAppDispatch } from "@/libs/redux";
import { PageTemplate } from "@/templates";
import { Button, Card } from "@/components";
import { addToast, validateFormLogin } from "@/utils";
import { LoginFormType } from "@/types";
import { AuthHeader } from "../components/AuthHeader";
import { AuthInput } from "../components/AuthInput";

export function AuthLoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleLogin = useCallback(
    (values: LoginFormType, actions: FormikHelpers<LoginFormType>) => {
      login(values)
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
          API(
            "get_user",
            {
              params: {
                uid,
              },
            },
            {
              showFailMessage: false,
            }
          )
        )
        .then((user) => {
          console.log("Fetched User: ");
          console.log(user.data);
          dispatch("update_user", user.data);
          router.push("/");
          addToast({ text: "Logged in." });
        })
        .catch((e) => {
          console.log(e);
          console.log("Login Error");
          actions.setSubmitting(false);
          addToast({ text: "Could not log in." });
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
              <AuthInput name="email" type="email" label="Email" isRequired />
              <AuthInput
                name="password"
                type="password"
                label="Password"
                isRequired
              />
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

  return <PageTemplate title="Login">{renderForm}</PageTemplate>;
}
