import { convertToBase64, getUserData } from "@/lib/utils";
import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "react-query";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "./ui/button";

const formSchema = z.object({
  currPassword: z
    .string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters." }),
  confirmPassword: z
    .string()
}).refine((values) => {
  return values.password === values.confirmPassword;
},
  {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  }
);

export default function UpdatePassword() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer: ${userData["token"]}`,
  }

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      currPassword: "",
      password: "",
      confirmPassword: "",
    }
  });

  const mutation = useMutation({
    mutationFn: async (update) => {
      return axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/updatepassword/${userData.userId}`,
        {
          currPassword: update.currPassword,
          password: update.password,
        },
        { headers: headers }
      );
    },
    onSuccess: () => {
      toast.success("Successfully updated password.");
    },
    onError: (error) => {
      const data = error.response.data;
      toast.error(data.error);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }


  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <FormField
          control={form.control}
          name='currPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Current Password
              </FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                New Password
              </FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Confirm New Password
              </FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-3">
          <Button type="submit">Update</Button>
        </div>
      </form>
    </Form>
  )
}