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

export interface PostCardProps {
  title: string,
  body: string,
  image: string | null,
  latitude: number,
  longitude: number,
  authorId: string,
  tags: string[] | null,
  id: string,
}

// TODO

export default function PostCard({ title, body, image, latitude, longitude, authorId, tags, id }: PostCardProps) {
  return (
    <Link to={`/posts/${id}`}>
      <Card className="break-inside-avoid mb-5 bg-no-repeat bg-cover">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <CardDescription>
            {body}
          </CardDescription>

        </CardHeader>
        {image ? <CardContent><img src={image} className="object-cover h-48 w-48 rounded-md"/></CardContent> : <></>}
        <CardFooter>
          <div className="flex gap-2 flex-wrap">
            {tags ? tags.map((tag) => (<Badge>{tag}</Badge>)) : <></>}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}