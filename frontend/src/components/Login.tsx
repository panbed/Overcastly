import { useState } from 'react';

import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button, buttonVariants } from "@/components/ui/button"
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { z } from 'zod';
import { useMutation, useQueryClient } from 'react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { toast } from 'sonner';
import { LoaderCircleIcon } from "lucide-react"

const formSchema = z.object({
  login: z
    .string()
    .min(1, { message: "" })
    .max(50, { message: "" }),
  password: z
    .string()
    .min(1, { message: "" })
    .max(128, { message: "" }),
})

export default function Login({ setLoginState }) {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      login: "",
      password: "",
    }
  });

  const mutation = useMutation({
    mutationFn: async (doLogin) => {
      return axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        {
          login: doLogin.login,
          password: doLogin.password,
        }
      );
    },
    onSuccess: (res) => {
      const data = res.data;
      const user = {
        token: data.token,
        userId: data.userId,
        username: data.username,
        email: data.email,
      }
      localStorage.setItem('userData', JSON.stringify(user));

      navigate('/');
    },
    onError: (error) => {
      const data = error.response.data;
      if (data.active == false && data.userId) {
        localStorage.setItem('userData', JSON.stringify({
          userId: data.userId,
        }));
        setLoginState("verify");
      }
      else {
        toast.error(data.error)
      }
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <div className='flex flex-col gap-3'>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name='login'
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Username or Email
                </FormLabel>
                <FormControl>
                  <Input placeholder='Username or Email' {...field} />
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
                  <Input type='password' placeholder='Password' {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' className='w-full mt-5'>Login</Button>
        </form>
        {mutation.isLoading ? 
        <div className="flex justify-center align-middle items-center">
          <LoaderCircleIcon className="animate-spin" /> 
        </div>
        : <></>}
        <Button className='text-muted-foreground hover:text-primary' variant="link" onClick={() => setLoginState("recovery")}>Forgot Password?</Button>
      </div>
    </Form>
  );
};
