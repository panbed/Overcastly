import { LoaderCircleIcon } from "lucide-react";

export default function LoadingPage() {
  return (
    <div className="flex items-center justify-center h-full">
      <LoaderCircleIcon className="size-1/12 animate-spin" />
    </div>
  )
}