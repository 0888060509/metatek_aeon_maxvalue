
"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useRouter } from "next/navigation";

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

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email." }),
  password: z.string().min(1, { message: "Password is required." }),
  remember: z.boolean().optional(),
});

export function LoginForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: false,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    // Here you would typically handle authentication
    console.log(values);

    toast({
      title: "Login Successful",
      description: "Redirecting...",
    });

    // Mock role-based redirection
    // In a real app, you'd get the user's role from your auth provider
    const isFieldUser = values.email.includes("field");

    if (isFieldUser) {
        router.push("/home"); // Redirect Field User to their home page
    } else {
        router.push("/app/dashboard"); // Redirect Back Office user to dashboard
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email address</FormLabel>
              <FormControl>
                <Input placeholder="you@example.com" {...field} />
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
                <Input type="password" placeholder="••••••••" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-center justify-between">
            <FormField
            control={form.control}
            name="remember"
            render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                <FormControl>
                    <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    />
                </FormControl>
                <div className="space-y-1 leading-none">
                    <FormLabel>
                    Remember me
                    </FormLabel>
                </div>
                </FormItem>
            )}
            />
            <div className="text-sm">
                <a href="#" className="font-semibold text-primary hover:text-primary/90">
                Forgot password?
                </a>
            </div>
        </div>
        <div>
          <Button type="submit" className="w-full">
            Sign in
          </Button>
           <p className="mt-4 text-xs text-center text-muted-foreground">
              Hint: Use `user@field.com` for Field User view, or any other email for Back Office view.
            </p>
        </div>
      </form>
    </Form>
  );
}
