import { Edit2Icon, TrashIcon } from "lucide-react";
import { Button } from "./ui/button";
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
import { useMutation, useQueryClient } from "react-query";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getUserData } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

export default function PostControls( {id, type}: {id: string, type: string} ) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState([]);
  
  useEffect(() => {
    setUserData(getUserData());
  }, []);

  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer: ${userData["token"]}`,
  }

  const mutation = useMutation({
    mutationFn: () => {
      return axios.delete(`${import.meta.env.VITE_BACKEND_URL}/api/deletepost/${id}`, {headers: headers});
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["repliesData"]);
      toast.success("Your post has been deleted.");
      if (type === "main") {
        navigate(`/posts`);
      }
    }
  })

  function handleDelete() {
    event.preventDefault();
    console.log(`Deleting reply ${id}...`);

    mutation.mutate();
  }

  return (
    <div>
      {/* <Button variant="ghost">
        <Edit2Icon />
      </Button> */}
      <Dialog>
        <DialogTrigger>
          <Button variant="ghost">
            <TrashIcon />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>Your post will be removed. This action cannot be undone.</DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <DialogClose asChild>
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleDelete} variant="destructive">
                Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}