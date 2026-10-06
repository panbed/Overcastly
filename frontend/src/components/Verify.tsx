"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { Link, useNavigate } from "react-router-dom"
import { useMutation } from "react-query"
import axios from "axios"
import { toast } from "sonner"
import { useState } from "react"

const formSchema = z.object({
  pin: z.string().min(4, {
    message: "Your one-time password must be 4 characters.",
  }),
});

export default function Verify({ setLoginState }) {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (pinVerify) => {
      const userId = JSON.parse(localStorage.getItem("userData")).userId;
      return axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/completeregisteruser/${userId}`,
        {
          userPin: pinVerify.pin,
        } 
      );
    },
    onSuccess: (res) => {
      localStorage.removeItem("userData");
      toast.success("Successfully verified account. Please log in");
      setLoginState("login");
    },
    onError: (error) => {
      const data = error.response.data;
      setMessage(data.error);
      toast.error(data.error);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col w-3/4 space-y-6">
        <FormField
          control={form.control}
          name="pin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>One-Time Code</FormLabel>
              <FormControl>
                <InputOTP maxLength={4} {...field}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormDescription>
                Please enter the 4 digit one-time code sent to your e-mail.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Submit</Button>
      </form>
    </Form>

  )
} 