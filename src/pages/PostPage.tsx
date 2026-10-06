import { useParams } from "react-router-dom";
import axios from "axios";
import { useQuery } from "react-query";
import PostThreadMainCard from "@/components/PostThreadMainCard";
import PostThreadReplyCard, { ReplyProps } from "@/components/PostThreadReplyCard";
import LoadingPage from "./LoadingPage";
import ErrorPage from "./ErrorPage";
import { useEffect, useRef, useState } from "react";
import { PostDatabaseProps } from "./SocialPage";
import PostThreadAuthor from "@/components/PostThreadAuthor";
import PostPageBar from "@/components/PostPageBar";
import { toast } from "sonner";

// TODO

export default function PostPage() {
  const { id } = useParams();

  const [mainPost, setMainPost] = useState<null | PostDatabaseProps>(null);
  const [repliesJSON, setRepliesJSON] = useState<any>(null);

  const bottomPageRef = useRef<null | HTMLDivElement>(null);

  const [userData, setUserData] = useState([]);

  useEffect(() => {
    const userDataString = localStorage.getItem("userData");
    if (userDataString) {
      setUserData(JSON.parse(userDataString))
      console.log(userData);
    }
    else console.log("Error parsing user data, perhaps the token is invalid?");
    
  }, []);

  async function getPost() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}`);
    return response;
  }

  async function getReplies() {
    const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/posts/${id}/getreplies`);
    return response;
  }

  const {
    data: post,
    error: postError,
    isLoading: postLoading,
  } = useQuery("postData", getPost, {
    onSuccess: (post) => {
      setMainPost(post.data);
    }
  });

  const {
    data: replies,
    error: repliesError,
    isLoading: repliesLoading,
  } = useQuery("repliesData", getReplies, {
    onSuccess: (replies) => {
      setRepliesJSON(replies);
    },
    // enabled: Boolean(post),
  })

  if (postLoading) {
    return (
      <div className="h-[calc(100vh-4rem)]">
        <LoadingPage />
      </div>
    );
  }

  if (postError || repliesError) {
    return (
      <>
        <ErrorPage errorMessage={`Error!`} />
      </>
    );
  }

  return (
    <>
      {mainPost ? <PostPageBar id={mainPost._id} bottomRef={bottomPageRef}/> : <></>}
      <div className="p-5">
        {mainPost ?
          <div>
            <PostThreadMainCard
              key={mainPost._id}
              title={mainPost.title}
              body={mainPost.body}
              image={mainPost.image}
              latitude={mainPost.latitude}
              longitude={mainPost.longitude}
              authorId={mainPost.authorId}
              tags={mainPost.tags}
              id={mainPost._id}
            />
          </div> : <></>}
        <div className="flex flex-col gap-3">
          {repliesJSON ? repliesJSON.data.map((reply: ReplyProps) =>
            <div key={reply._id}>
              <PostThreadReplyCard body={reply.body} image={reply.image} authorId={reply.authorId} id={reply._id} userId={userData["userId"]}/>
            </div>
          ) : <></>}
        </div>
        <div ref={bottomPageRef}></div>
      </div>
    </>
  );
}