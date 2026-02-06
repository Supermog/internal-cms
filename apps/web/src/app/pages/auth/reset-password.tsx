import { ResetPasswordForm } from "@/admin/features/reset-password/components/reset-password.form";
import { Helmet } from "react-helmet-async";

function ResetPassword() {
  return (
    <>
      <Helmet>
        <title>Reset Password</title>
      </Helmet>

      <div className="w-full h-full flex justify-center items-center">
        <ResetPasswordForm />
      </div>
    </>
  );
}

export { ResetPassword };
