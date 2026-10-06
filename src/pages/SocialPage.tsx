import { useQuery } from "react-query";
import axios from "axios";

import PostCard from "@/components/PostCard";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import SocialBar from "@/components/SocialBar";

export interface PostDatabaseProps {
  title: string,
  body: string,
  image: string | null,
  latitude: number,
  longitude: number,
  authorId: string,
  tags: string[] | null,
  _id: string,
}



export default function SocialPage() {
  const userLatitude = Number(localStorage.getItem('latitude') || -1);
  const userLongitude = Number(localStorage.getItem('longitude') || -1);
  
  async function getPosts() {
    console.log("distance: " + localStorage.getItem("distance"))
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
  } = useQuery("postsData", getPosts);

  if (isLoading) return <LoadingPage />
  if (error) return <ErrorPage errorMessage={`${error}`}/>

  return (
    <>
    <SocialBar />
      <div className="p-3 md:p-5 2xl:columns-6 xl:columns-5 lg:columns-4 sm:columns-3 columns-2 gap-4">
        {posts.map((post: PostDatabaseProps) =>
          <PostCard key={post._id}
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
      </div>
    </>
  );
}