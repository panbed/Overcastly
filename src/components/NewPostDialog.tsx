import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"


import { Button } from "@/components/ui/button"
import { PlusIcon } from "lucide-react"
import NewPostForm from "./NewPostForm";
import { useEffect, useState } from "react";
import { getUserData } from "@/lib/utils";
import PostThreadAuthor from "./PostThreadAuthor";

export default function NewPostDialog() {
  const [userData, setUserData] = useState(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setUserData(getUserData());
  }, []);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger>
        <Button variant="ghost">
          <PlusIcon />
        </Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Post</SheetTitle>
        </SheetHeader>
        <div className="pb-4 pt-4">
          {userData ? <PostThreadAuthor authorId={userData["userId"]} /> : <></>}
        </div>
        <NewPostForm setOpen={setOpen} />
      </SheetContent>
    </Sheet>

  );
}