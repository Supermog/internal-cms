import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import {
  ResetPasswordFormData,
  resetPasswordSchema,
} from "../types/reset-password.schema";
import { authService } from "@/features/auth/auth.service";
import { routePaths } from "@/app/config/route-paths.config";

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Extract token from URL hash or query params
    // Supabase sends tokens in the URL hash as access_token and refresh_token
    // Format: #access_token=xxx&type=recovery&refresh_token=yyy
    const hashParams = new URLSearchParams(window.location.hash.substring(1));
    const accessToken = hashParams.get("access_token");
    const queryToken = searchParams.get("token");

    console.log("accessToken", accessToken);
    console.log("queryToken", queryToken);

    if (accessToken) {
      console.log("setting accessToken");
      setToken(accessToken);
    } else if (queryToken) {
      setToken(queryToken);
    } else {
      form.setError("root", {
        message:
          "Invalid or missing reset token. Please request a new password reset link.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: ResetPasswordFormData) {
    if (!token) {
      form.setError("root", {
        message:
          "Invalid or missing reset token. Please request a new password reset link.",
      });
      return;
    }

    try {
      await authService.resetPassword(values.password, token);
      setIsSuccess(true);
      setTimeout(() => {
        navigate(routePaths.signIn);
      }, 2000);
    } catch (error: any) {
      console.error(error);
      const errorMessage =
        error?.message ||
        "Failed to reset password. Please try again or request a new link.";
      form.setError("root", {
        message: errorMessage,
      });
    }
  }

  if (isSuccess) {
    return (
      <div className="w-full max-w-md space-y-6">
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Password reset successfully</AlertTitle>
          <AlertDescription>
            Your password has been reset. Redirecting to sign in...
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>New Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  autoFocus
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm Password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="••••••••"
                  {...field}
                  autoComplete="new-password"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {form.formState.errors.root && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              {form.formState.errors.root.message}
            </AlertDescription>
          </Alert>
        )}

        <Button
          type="submit"
          className="w-full"
          isLoading={form.formState.isSubmitting}
          disabled={!token}
        >
          Reset Password
        </Button>

        <div className="text-center">
          <Button variant="link" className="h-auto p-0 text-muted" asChild>
            <Link to={routePaths.signIn}>Back to Sign In</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
