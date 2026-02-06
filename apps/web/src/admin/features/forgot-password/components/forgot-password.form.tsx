import { AlertCircle, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";
import { useState } from "react";

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
  ForgotPasswordFormData,
  forgotPasswordSchema,
} from "../types/forgot-password.schema";
import { authService } from "@/admin/features/auth/auth.service";
import { commonRoutePaths } from "@/app/config/route-paths.config";

export function ForgotPasswordForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: ForgotPasswordFormData) {
    try {
      await authService.forgotPassword(values.email);
      setIsSubmitted(true);
    } catch (error) {
      console.error(error);
      form.setError("root", {
        message: "Failed to send reset email. Please try again.",
      });
    }
  }

  if (isSubmitted) {
    return (
      <div className="w-full max-w-md space-y-6">
        <Alert>
          <CheckCircle2 className="h-4 w-4" />
          <AlertTitle>Check your email</AlertTitle>
          <AlertDescription>
            If an account with that email exists, a password reset link has been
            sent.
          </AlertDescription>
        </Alert>
        <Button variant="link" className="w-full" asChild>
          <Link to={commonRoutePaths.signIn}>Back to Sign In</Link>
        </Button>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  placeholder="olivia@classview.com"
                  {...field}
                  autoFocus
                  autoComplete="email"
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
        >
          Send Reset Link
        </Button>

        <div className="text-center">
          <Button variant="link" className="h-auto p-0 text-muted" asChild>
            <Link to={commonRoutePaths.signIn}>Back to Sign In</Link>
          </Button>
        </div>
      </form>
    </Form>
  );
}
