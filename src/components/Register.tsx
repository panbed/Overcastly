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
  username: z
    .string()
    .min(1, { message: "" })
    .max(50, { message: "Username is too long." }),
  email: z
    .string()
    .min(1, { message: "" })
    .max(100, { message: "Email is too long." })
    .email({ message: "Please enter a valid email address." }),
  firstName: z
    .string()
    .min(1, { message: "" })
    .max(50, { message: "First name is too long." }),
  lastName: z
    .string()
    .min(1, { message: "" })
    .max(50, { message: "Last name is too long." }),
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

export default function Register({ setLoginState }) {

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
      password: "",
      confirmPassword: "",
    }
  });

  const mutation = useMutation({
    mutationFn: async (doRegister) => {
      return axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/initialregisteruser`,
        {
          username: doRegister.username,
          email: doRegister.email,
          firstName: doRegister.firstName,
          lastName: doRegister.lastName,
          password: doRegister.password,
        }
      );
    },
    onSuccess: (res) => {
      const data = res.data;
      localStorage.setItem('userData', JSON.stringify({
        userId: data.insertedId,
      }));
      setLoginState("verify");
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
      <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-3'>
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Username
              </FormLabel>
              <FormControl>
                <Input placeholder='person' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Email
              </FormLabel>
              <FormControl>
                <Input type='email' placeholder='person@example.com' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='firstName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                First Name
              </FormLabel>
              <FormControl>
                <Input placeholder='Johnny' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name='lastName'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Last Name
              </FormLabel>
              <FormControl>
                <Input placeholder='Appleseed' {...field} />
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
                Password
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
                Confirm Password
              </FormLabel>
              <FormControl>
                <Input type='password' {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type='submit'>Register</Button>
      </form>
    </Form>
  );
};
