import { SignInForm } from "@/admin/features/sign-in/components/sign-in.form";
import { Helmet } from "react-helmet-async";

function SignIn() {
  return (
    <>
      <Helmet>
        <title>Sign in</title>
      </Helmet>

      <div className="w-full h-full flex justify-center items-center">
        <SignInForm />
      </div>
    </>
  );
}

export { SignIn };
