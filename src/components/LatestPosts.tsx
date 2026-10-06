import { useEffect, useState } from "react"
import axios from "axios";
import { useQuery } from "react-query";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { CloudIcon, CloudSunIcon, SunIcon, Users, WindIcon } from "lucide-react";

import { PostDatabaseProps } from "@/pages/SocialPage";
import { ScrollArea } from "./ui/scroll-area";
import PostList from "./PostList";

export default function LatestPosts() {
  const userLatitude = Number(localStorage.getItem('latitude') || -1);
  const userLongitude = Number(localStorage.getItem('longitude') || -1);

  async function getPosts() {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/getlocalposts`, {
      latitude: userLatitude,
      longitude: userLongitude,
      distance: localStorage.getItem("distance") ? localStorage.getItem("distance") : 1.6875,
    });

    return response.data;
  }

  const {
    data: posts,
    error,
    isLoading,
  } = useQuery("postsDashData", getPosts, {
    onSuccess: (data) => {
      console.log(data);
    }
  });

  if (isLoading) {
    return (
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Recent Posts</CardTitle>
            <CardDescription>Now loading...</CardDescription>
          </CardHeader>

          <CardContent className="flex justify-center">
            <Users className="animate-spin" />
          </CardContent>

          <CardFooter>
            Please wait...
          </CardFooter>
        </Card>
      </div>
    );
  }


  return (
    <div>
      <Card>
        <CardHeader>
          <CardTitle>Recent Posts</CardTitle>
          <CardDescription>{posts.length > 0 ? `${posts.length} total posts!` : "No posts found!"}</CardDescription>
        </CardHeader>

        <CardContent>
          {posts.length > 0 ? 
          <>
            <ScrollArea className="h-64 md:w-72 lg:w-96">
              {posts.map((post: PostDatabaseProps) =>
                <PostList key={post._id}
                  title={post.title}
                  body={post.body}
                  image={post.image}
                  latitude={post.latitude}
                  longitude={post.longitude}
                  authorId={post.authorId}
                  tags={post.tags}
                  id={post._id}
                />
              )}
            </ScrollArea>
          </> : <p>Stir up a conversation!</p>}
        </CardContent>
      </Card>
    </div>

  )
}