import { useState } from 'react';

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useMutation } from 'react-query';
import { toast } from 'sonner';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import axios from 'axios';

const formSchema = z.object({
  email: z
    .string()
    .min(1, { message: "" })
    .max(100, { message: "Email is too long." })
    .email({ message: "Please enter a valid email address." }),
});

export default function Recovery( {setLoginState} ) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    }
  });

  const mutation = useMutation({
    mutationFn: async (resetPassword) => {
      return axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/resetpassword`,
        {
          email: resetPassword.email,
        }
      );
    },
    onSuccess: () => {
      setLoginState("login");
      toast.success("Successfully reset password. Please check your email for further instructions.");
    },
    onError: (error) => {
      const data = error.response.data;
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
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input type='email' placeholder='person@example.com' {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <Button type="submit">Submit</Button>
    </form>
  </Form>
  );

}