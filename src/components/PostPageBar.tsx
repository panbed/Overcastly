import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "./ui/form";
import { SendHorizonalIcon, ImageIcon } from "lucide-react";
import { QueryClient, useIsMutating, useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { RefObject, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { toast } from "sonner"
import PostThreadAuthor from "./PostThreadAuthor";
import { convertToBase64, getUserData } from "@/lib/utils";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import ProfilePicture from "./ProfilePicture";
import { Label } from "./ui/label";
import { buttonVariants } from "@/components/ui/button"

// TODO

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

const formSchema = z.object({
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
      console.log(file);
      return !file || ACCEPTED_IMAGE_TYPES.includes(file.type);
    }, "File must be of either .png, .jpg, or .webp format."),
});

export default function PostPageBar({ id, bottomRef }: { id: string, bottomRef: RefObject<HTMLDivElement> }) {
  const queryClient = useQueryClient();

  const [isDisabled, setIsDisabled] = useState(false);
  const [hasImage, setHasImage] = useState(false);
  const [userData, setUserData] = useState([]);

  useEffect(() => {
    setUserData(getUserData());
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      body: "",
      image: null,
    }
  });

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer: ${userData["token"]}`,
  }

  const mutation = useMutation({
    mutationFn: async (newReply) => {
      let base64Image = null;
      if (newReply.image) {
        base64Image = await convertToBase64(newReply.image);
      }
      return axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/createreply`,
        {
          body: newReply.body,
          image: base64Image,
          originalPostId: id,
        },
        { headers: headers }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["repliesData"]);
      toast("Successfully created reply!");
      form.reset();
      setHasImage(false);

      setTimeout(function() {
        setIsDisabled(false);
      }, 1000);
    },
    onError: (error) => {
      toast("Encountered an error when trying to reply: " + error);
      setTimeout(function() {
        setIsDisabled(false);
      }, 1000);
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {

    setIsDisabled(true);
    mutation.mutate(values);
  }

  return (
    <Form {...form}>
      <form id="replyForm" onSubmit={form.handleSubmit(onSubmit)} className="flex flex-nowrap z-10 bg-background sticky top-0 w-full p-5 gap-3 items-center shadow-sm mx-auto">
        <ProfilePicture authorId={userData["userId"]} />
        <FormField
          control={form.control}
          name="body"
          render={({ field }) => (
            <FormItem className="flex flex-1">
              <FormControl>
                <Input type="textarea" placeholder="Leave a reply..." {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <>
                  <Label htmlFor="image" className={buttonVariants({ variant: hasImage ? "secondary" : "outline" })}>
                    <ImageIcon />
                  </Label>
                  <Input type="file" id="image" onChange={(e) => { e.preventDefault(); field.onChange(e.target.files?.[0]); setHasImage(true); }} className="hidden"/>
                </>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-2">
          <Button type="submit" disabled={isDisabled}>
            <SendHorizonalIcon />
          </Button>
        </div>
      </form>
    </Form>
  );
}