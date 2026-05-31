"use client";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

type FormData = z.infer<typeof schema>;

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, getValues, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (_data: FormData) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-950 flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-blue-500" />
        </div>
        <div>
          <h1 className="text-2xl font-bold mb-2">Check your email</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            If an account exists for <strong>{getValues("email")}</strong>, we&apos;ve sent
            password reset instructions to that address.
          </p>
        </div>
        <Button asChild variant="outline" className="w-full">
          <Link href="/login">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Sign In
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Reset your password</h1>
        <p className="text-muted-foreground mt-2 text-sm">
          Enter your email address and we&apos;ll send you a reset link.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email address</Label>
          <Input
            id="email"
            type="email"
            placeholder="you@example.com"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
          />
          {errors.email && <p className="text-xs text-destructive">{errors.email.message}</p>}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading} variant="gradient" size="lg">
          {isLoading ? (
            <><Loader2 className="w-4 h-4 animate-spin mr-2" />Sending...</>
          ) : (
            "Send Reset Link"
          )}
        </Button>
      </form>

      <div className="text-center">
        <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground flex items-center justify-center gap-1">
          <ArrowLeft className="w-3 h-3" />
          Back to Sign In
        </Link>
      </div>
    </div>
  );
}
