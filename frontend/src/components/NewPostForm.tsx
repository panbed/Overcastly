"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import { Label } from "@/components/ui/label"

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
import { Input } from "@/components/ui/input"
import { Textarea } from "./ui/textarea"
import { useEffect, useState } from "react"
import { convertToBase64, getUserData } from "@/lib/utils"
import ProfilePicture from "./ProfilePicture"
import { useMutation, useQueryClient } from "react-query"

import { SheetClose } from "./ui/sheet"
import axios from "axios"
import { toast } from "sonner"
import { Navigate, useNavigate } from "react-router-dom"

import { TagsInput } from "./ui/tags-input"

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  title: z
    .string()
    .min(1, { message: "Enter a title." })
    .max(50, { message: "Maximum word count is 50." }),
  body: z
    .string()
    .min(1, { message: "Enter body text." })
    .max(1000, { message: "Maximum word count is 1000 words." }),
  image: z
    .instanceof(File).optional().nullable()
    .refine((file) => {
      return !file || file.size <= MAX_IMAGE_SIZE;
    }, `File size must be less than 5 MB`)
    .refine((file) => {
      return !file || ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, 'File must be of either .png, .jpg, or .webp format.'),

});

export default function NewPostForm({ setOpen }) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [userData, setUserData] = useState([]);
  const [tags, setTags] = useState<string[]>([]);

  useEffect(() => {
    setUserData(getUserData());
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      body: "",
      image: null,
    }
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer: ${userData["token"]}`,
  }

  const mutation = useMutation({
    mutationFn: async (newPost) => {
      let base64Image = null;
      if (newPost.image) {
        base64Image = await convertToBase64(newPost.image);
      }
      return axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/createpost`,
        {
          title: newPost.title,
          body: newPost.body,
          image: base64Image,
          latitude: localStorage.getItem("latitude"),
          longitude: localStorage.getItem('longitude'),
          tags: tags,
        },
        { headers: headers }
      );
    },
    onSuccess: (postData) => {
      queryClient.invalidateQueries(["postsData"]);
      navigate(`posts/${postData.data.postId}`);
      setOpen(false);
      setTags([]);
    },
    onError: (error) => {
      toast.error("Unable to create new post: " + error);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
    console.log(tags);
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Title</FormLabel> */}
              <FormControl>
                <Input placeholder="Title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Body</FormLabel> */}
              <FormControl>
                <Textarea placeholder="Body" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              {/* <FormLabel>Image</FormLabel> */}
              <FormControl>
                <Input type="file" id="image" onChange={(e) => field.onChange(e.target.files?.[0])} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <TagsInput 
          value={tags}
          onValueChange={setTags}
          placeholder="Enter tags"
          className="w-full"
        />
        <div className="flex justify-end mt-3">
          <Button type="submit">Create Post</Button>
        </div>
      </form>
    </Form>
  );
}