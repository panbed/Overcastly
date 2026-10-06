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

import PostThreadAuthor from "./PostThreadAuthor";

import { dateFromObjectId } from "@/lib/utils";
import { useEffect, useState } from "react";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Edit2Icon, TrashIcon } from "lucide-react";
import PostControls from "./PostControls";


export interface ReplyProps {
  title?: string,
  body: string,
  image: string | null,
  latitude?: number,
  longitude?: number,
  authorId: string,
  tags?: string[] | null,
  id: string,
  userId: string,
}

// TODO

export default function PostThreadReplyCard({ body, image, authorId, id, userId }: ReplyProps) {
  
  return (
    <div>
      <Card className="grow" data-post-id={id}>
        <CardHeader className="flex flex-1 flex-row justify-between">
          <PostThreadAuthor authorId={authorId}/>
          {userId == authorId ? <PostControls id={id} type="reply" /> : <></>}
        </CardHeader>
        <CardContent>
          {body}
          {image ? <img src={image} className="rounded-sm object-scale-down mt-3"/> : <></>}
        </CardContent>
        <CardFooter>
          <CardDescription>
            {`${dateFromObjectId(id).toLocaleTimeString()} · ${dateFromObjectId(id).toDateString()} `}
          </CardDescription>
        </CardFooter>
      </Card>

    </div>
  );
}