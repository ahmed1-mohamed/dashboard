"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { useFirebaseMessaging } from "@/hooks/use-firebase-messaging";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function SignInPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const { fcmToken } = useFirebaseMessaging();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    console.log("=== onSubmit called ===", data);
    setIsLoading(true);
    try {
      console.log("Calling signIn with:", { email: data.email, fcmToken });
      const result: any = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
        "fcm-token": fcmToken || "",
      });

      console.log("SignIn Result:", result);

      if (result?.error) {
        console.log("SignIn Error:", result.error);
        toast({
          title: "Error",
          description: result.error || "Invalid email or password",
          variant: "destructive",
        });
      } else if (result?.ok) {
        toast({
          title: "Success",
          description: "Logged in successfully",
        });

        const res = await fetch("/api/auth/session");
        const sessionData = await res.json();

        document.cookie = `role_id=${sessionData.user.role_name}; path=/`;
        document.cookie = `token=${sessionData.accessToken}; path=/`;

        const role = sessionData?.user?.role_name;

        if (role === "admin") {
          router.push("/admin/home");
        } else if (role === "expert") {
          router.push("/expert/home");
        } else if (role === "developer") {
          router.push("/developer/home");
        }
      }
    } catch (error) {
      console.error("SignIn Exception:", error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-teal-600">
      {/* Geometric Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-0 left-0 w-96 h-96 bg-teal-500/30 rounded-full -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/4 right-0 w-80 h-80 bg-teal-700/20 rounded-full translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-72 h-72 bg-teal-500/20 rounded-full translate-y-1/2" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-teal-700/30 rounded-full" />
      </div>

      {/* Login Card */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl p-12">
          <h1 className="text-2xl font-semibold text-gray-900 mb-8">
            Login to your account
          </h1>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email and Password Row */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="email">
                  Your email <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  {...register("email")}
                  disabled={isLoading}
                  className="bg-gray-50 border-gray-200"
                />
                {errors.email && (
                  <p className="text-sm text-red-500">{errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">
                  Your password <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••••"
                  {...register("password")}
                  disabled={isLoading}
                  className="bg-gray-50 border-gray-200"
                />
                {errors.password && (
                  <p className="text-sm text-red-500">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Remember me and Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" />
                <label
                  htmlFor="remember"
                  className="text-sm text-gray-700 cursor-pointer"
                >
                  Remember me
                </label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-gray-900 hover:underline"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-teal-600 hover:bg-teal-700 text-white h-12 text-base font-medium"
            >
              {isLoading ? "Logging in..." : "Log in"}
            </Button>

            {/* Divider */}
            {/* <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">or</span>
              </div>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}
