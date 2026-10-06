import * as React from "react"
import { LoaderCircleIcon, SearchIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useEffect, useState } from "react"
import { useMutation } from "react-query"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"
import axios from "axios"

export function SocialSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [posts, setPosts] = useState([]);

  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (search) => {
      return axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/generalsearchposts`, {
        search: search,
      });
    },
    onSuccess: (posts) => {
      console.log(posts.data);
      setPosts(posts.data);
    },
    onError: () => {
      toast.warning("An error occurred while searching.");
    }
  });

  useEffect(() => {
    if (query.length > 1) {
      mutation.mutate(query);
    }
  }, [query]);

  function onSearchChange(e) {
    setQuery(e.target.value);
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          Search posts...
          <SearchIcon className="opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="" className="h-9" onChangeCapture={onSearchChange} />
          <CommandList>
            <CommandEmpty>
              {mutation.isLoading ? 
              <div className="flex justify-center">
                <LoaderCircleIcon className="animate-spin"/>
              </div> : "No posts found."}
            </CommandEmpty>
            {/* NOTE: idk what the issue with this even is but i think youre not supposed to use this as a dynamic search box */}
            <CommandGroup>
              {posts?.map((post) => (
                <CommandItem
                  key={post._id}
                  // value={post._id}
                  onSelect={() => navigate(`/posts/${post._id}`)}
                >
                  {post.title}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
