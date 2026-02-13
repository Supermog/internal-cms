import { Helmet } from "react-helmet-async";
import { SignUpForm } from "@/features/sign-up/components/sign-up.form";

function SignUp() {
  return (
    <>
      <Helmet>
        <title>Sign up</title>
      </Helmet>

      <div className="w-full h-full flex justify-center items-center">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="text-2xl font-semibold mb-2">Create Your Account</h1>
            <p className="text-muted-foreground">
              Enter your details to accept the invitation
            </p>
          </div>
          <SignUpForm />
        </div>
      </div>
    </>
  );
}

export { SignUp };
