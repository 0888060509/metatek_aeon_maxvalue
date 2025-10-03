
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";

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
import { useToast } from "@/hooks/use-toast";
import { Checkbox } from "./ui/checkbox";
import { useLogin, tokenManager, ApiError, decodeJWT, getUserRole } from "@/api";

const formSchema = z.object({
  username: z.string().min(1, { message: "Username is required." }),
  password: z.string().min(1, { message: "Password is required." }),
  remember: z.boolean().optional(),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();
  const { loading, error, execute: login } = useLogin();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      remember: false,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setIsSubmitting(true);
      setLoginError(null); // Clear previous errors
      
      const result = await login({
        username: values.username,
        password: values.password,
      });

      if (result?.accessToken) {
        tokenManager.storeTokens(result.accessToken, result.refreshToken!);

        // Get user role from access token for immediate routing
        const userInfo = decodeJWT(result.accessToken);
        const userRole = getUserRole(userInfo);

        toast({
          title: "Đăng nhập thành công",
          description: "Đang chuyển hướng...",
        });

        // Role-based redirection
        if (userRole === 'field') {
          router.push("/home"); // Redirect Field User to their home page
        } else {
          router.push("/app/dashboard"); // Redirect Back Office user to dashboard
        }
      }
    } catch (err: any) {
      setLoginError(err.message);
      
      toast({
        title: "Đăng nhập thất bại",
        description: err.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tên đăng nhập</FormLabel>
              <FormControl>
                <Input placeholder="Nhập tên đăng nhập" {...field} />
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
              <FormLabel>Mật khẩu</FormLabel>
              <FormControl>
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div>
          <Button 
            type="submit" 
            className="w-full" 
            disabled={loading || isSubmitting}
          >
            {loading || isSubmitting ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
          {(loginError || error) && (
            <p className="mt-2 text-sm text-destructive text-center">
              {loginError || error}
            </p>
          )}
          <p className="mt-4 text-xs text-center text-muted-foreground">
            Gợi ý: Sử dụng tên đăng nhập có chứa "field" để truy cập giao diện Field User.
          </p>
        </div>
      </form>
    </Form>
  );
}
