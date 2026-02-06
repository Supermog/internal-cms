import { ForgotPasswordForm } from "@/admin/features/forgot-password/components/forgot-password.form";
import { Helmet } from "react-helmet-async";

function ForgotPassword() {
  return (
    <>
      <Helmet>
        <title>Forgot Password</title>
      </Helmet>

      <div className="w-full h-full flex justify-center items-center">
        <ForgotPasswordForm />
      </div>
    </>
  );
}

export { ForgotPassword };
