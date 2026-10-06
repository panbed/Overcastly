import { convertToBase64, getUserData } from "@/lib/utils";
import axios from "axios";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { z } from "zod"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { Input } from "./ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Button } from "./ui/button";
import ProfilePicture from "./ProfilePicture";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
  image: z
    .instanceof(File).optional().nullable()
    .refine((file) => {
      return !file || file.size <= MAX_IMAGE_SIZE;
    }, `File size must be less than 5 MB`)
    .refine((file) => {
      return !file || ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, 'File must be of either .png, .jpg, or .webp format.'),
});

export default function PictureSettingsForm() {
  
  const userData = JSON.parse(localStorage.getItem("userData"));
  const [profile, setProfile] = useState(null);
  const queryClient = useQueryClient();

  async function getProfile() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${userData.userId}`);
    return response;
  }

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer: ${userData["token"]}`,
  }

  const {
    data: author,
    error,
    isLoading,
  } = useQuery("profileData", getProfile, {
    onSuccess: (data) => {
      setProfile(data.data);
      queryClient.invalidateQueries(["profileData"]);
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image: null,
    }
  });

  const mutation = useMutation({
    mutationFn: async (update) => {
      let base64Image = null;
      if (update.image) {
        base64Image = await convertToBase64(update.image);
      }

      return axios.put(
        `${import.meta.env.VITE_BACKEND_URL}/api/updateuser/${userData.userId}`,
        {
          image: base64Image,
        },
        { headers: headers }
      );
    },
    onSuccess: () => {
      toast.success("Successfully updated profile picture.");
    },
    onError: (error) => {
      toast.error(error?.data);
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
      <div className="flex justify-center p-5">
        <Avatar className="w-1/2 h-1/2">
          <AvatarImage src={author?.data.image}/>
          {/* <AvatarFallback>{author?.data.firstName[0] + author?.data.lastName[0]}</AvatarFallback> */}
        </Avatar>
      </div>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-3">
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
        <div className="flex justify-end mt-3">
          <Button type="submit">Update</Button>
        </div>
      </form>
    </Form>
  )
}