import { useCallback, useMemo } from "react";
import { signIn } from "next-auth/react";
import { Form, Formik, FormikHelpers } from "formik";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signUp } from "@/libs/firebase";
import { API } from "@/api";
import { PageTemplate } from "@/templates";
import { Button, Card, Paragraph } from "@/components";
import { validateFormSignUp } from "@/utils";
import { SignUpFormType } from "@/types";
import { AuthHeader } from "../components/AuthHeader";
import { AuthInput } from "../components/AuthInput";

export function AuthSignUpPage() {
  const router = useRouter();

  const handleSignUp = useCallback(
    async (values: SignUpFormType, actions: FormikHelpers<SignUpFormType>) => {
      const now = new Date().toUTCString();
      const { name, email, username } = values;

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
          API("post_user", {
            body: {
              id: username,
              name,
              uid,
              email,
              joinDate: now,
            },
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
            <Paragraph>
              Already have an account?
              <br />
              <Link href="/login">Login</Link> instead.
            </Paragraph>
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
              <AuthInput name="email" type="email" label="Email" isRequired />
              <AuthInput
                name="username"
                type="text"
                label="Username"
                isRequired
              />
              <AuthInput name="name" type="text" label="Display Name" />
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
                label="Sign Up"
              />
            </Form>
          )}
        </Formik>
      </Card>
    ),
    [handleSignUp]
  );

  return <PageTemplate title="Sign Up">{renderForm}</PageTemplate>;
}
