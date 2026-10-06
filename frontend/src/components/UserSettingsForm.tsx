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
  username: z
    .string()
    .min(1, { message: "" })
    .max(50, { message: "Username is too long." }),
  firstName: z
    .string()
    .min(1, { message: "" })
    .max(50, { message: "First name is too long." }),
  lastName: z
    .string()
    .min(1, { message: "" })
    .max(50, { message: "Last name is too long." }),
});

export default function UserSettingsForm() {
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [profile, setProfile] = useState(null);

  async function getProfile() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userData.userId}`);
    return response;
  };

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer: ${userData["token"]}`,
  };

  const {
    data: author,
    error,
    isLoading,
  } = useQuery("profileData", getProfile, {
    onSuccess: (data) => {
      setProfile(data.data);
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: profile?.username,
      firstName: profile?.firstName,
      lastName: profile?.lastName,
    }
  });

  const mutation = useMutation({
    mutationFn: async (update) => {
      let updatedFields = {
        username: update.username,
        firstName: update.firstName,
        lastName: update.lastName,
      };

      console.log(updatedFields)

      return axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/updateuser/${userData.userId}`,
        updatedFields,
        { headers: headers }
      );
    },
    onSuccess: () => {
      toast.success("Successfully updated profile.");
    },
    onError: (error) => {
      const data = error.response.data;
      toast.error(data.error);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  useEffect(() => {
    form.reset(profile);
  }, [profile]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name='username'
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                Username
              </FormLabel>
              <FormControl>
                <Input {...field} />
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
                <Input {...field} />
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
                <Input {...field} />
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