import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import { Badge } from "@/components/ui/badge";

import { Link } from "react-router-dom";
import { PostCardProps } from "./PostCard";
import { MapPinIcon, PinIcon } from "lucide-react";

export default function PostList({ title, body, image, latitude, longitude, authorId, tags, id }: PostCardProps) {
  return (
    <Link to={`/posts/${id}`}>
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-md flex justify-center items-center border">
          {image ? <img src={image} className="object-cover h-10 w-10 rounded-md"/> : <MapPinIcon className="h-5 w-5" />}
        </div>
        <div className="flex flex-col w-full">
          <p className="">{title}</p>
          <p className="text-sm text-muted-foreground">{body}</p>
        </div>
      </div>
    </Link>
  );
}