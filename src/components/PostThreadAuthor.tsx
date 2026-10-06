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

export default function PostThreadAuthor({ authorId }: { authorId: string }) {
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
      <div className="flex gap-3 items-center">
      <Avatar>
        <AvatarFallback></AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h3>...</h3>
        <p className="text-sm text-muted-foreground">...</p>
      </div>
    </div>
    );
  }

  return (
    <div className="flex gap-3 items-center">
      <Avatar>
        <AvatarImage src={author?.data.image}/>
        <AvatarFallback>{author?.data.firstName[0] + author?.data.lastName[0]}</AvatarFallback>
      </Avatar>
      <div className="flex flex-col">
        <h3>{`${author?.data.firstName} ${author?.data.lastName}`}</h3>
        <p className="text-sm text-muted-foreground">@{author?.data.username}</p>
      </div>
    </div>
  );
}