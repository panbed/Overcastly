import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useQuery } from "react-query";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AuthorProps {
  id: string,
  username: string,
  firstName: string,
  lastName: string,
  image?: string | null,
}

// TODO

export default function ProfilePicture({ authorId }: { authorId: string }) {
  async function getAuthor() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/users/${authorId}`);
    return response;
  }

  const {
    data: author,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["authorData", authorId],
    queryFn: getAuthor,
  });

  if (isLoading || error) {
    return (
      <Avatar>
        <AvatarFallback></AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar>
      <AvatarImage src={author?.data.image}/>
      <AvatarFallback>{author?.data.firstName[0] + author?.data.lastName[0]}</AvatarFallback>
    </Avatar>
  );
}