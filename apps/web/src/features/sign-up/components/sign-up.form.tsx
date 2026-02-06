import { AlertCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect } from "react";

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

import { SignUpFormData, signUpSchema } from "../types/sign-up.schema";
import { useAcceptInvite } from "@/features/invites/api/accept-invite";
import { useValidateInvite } from "@/features/invites/api/validate-invite";
import {
  getInviteByCodeQueryKey,
  useGetInviteByCode,
} from "@/features/invites/api/get-invite-by-code";
import { commonRoutePaths } from "@/app/config/route-paths.config";
import { AcceptInviteDto } from "@internal-cms/shared";

export function SignUpForm() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const inviteCode = searchParams.get("code");

  const form = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      code: inviteCode || "",
      email: "",
      name: "",
      password: "",
      confirmPassword: "",
    },
  });

  // Validate invite code when component mounts or code changes
  const { data: validationResult, isLoading: isValidating } =
    useValidateInvite(inviteCode);

  // Get invite details to pre-fill email and name
  const { data: inviteDetails } = useGetInviteByCode(inviteCode, {
    enabled: !!inviteCode && validationResult?.valid === true,
    queryKey: getInviteByCodeQueryKey(inviteCode || ""),
  });

  const acceptInviteMutation = useAcceptInvite({
    onSuccess: () => {
      // Redirect to sign-in page after successful signup
      navigate(commonRoutePaths.signIn, {
        replace: true,
        state: { message: "Account created successfully. Please sign in." },
      });
    },
  });

  // Update form when invite code is found in URL (keep in form state for validation)
  useEffect(() => {
    if (inviteCode) {
      form.setValue("code", inviteCode);
    }
  }, [inviteCode, form]);

  // Pre-fill email and name from invite details
  useEffect(() => {
    if (inviteDetails) {
      if (inviteDetails.email) {
        form.setValue("email", inviteDetails.email);
      }
      if (inviteDetails.name) {
        form.setValue("name", inviteDetails.name);
      }
    }
  }, [inviteDetails, form]);

  async function onSubmit(values: SignUpFormData) {
    if (!inviteCode) {
      form.setError("code", {
        type: "manual",
        message: "Invite code is required",
      });
      return;
    }

    const payload: AcceptInviteDto = {
      code: inviteCode,
      email: values.email,
      name: values.name,
      password: values.password,
    };

    await acceptInviteMutation.mutateAsync(payload);
  }

  const isInviteInvalid =
    validationResult && !validationResult.valid && !isValidating;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        {isValidating && (
          <Alert>
            <AlertDescription>Validating invite code...</AlertDescription>
          </Alert>
        )}

        {isInviteInvalid && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Invalid Invite</AlertTitle>
            <AlertDescription>
              {validationResult.message ||
                "This invite code is invalid or has expired."}
            </AlertDescription>
          </Alert>
        )}

        {validationResult?.valid && (
          <>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="John Doe"
                      {...field}
                      autoFocus={!!inviteCode}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      disabled={true}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
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
          </>
        )}

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
          disabled={isInviteInvalid || isValidating}
        >
          Create Account
        </Button>
      </form>
    </Form>
  );
}
