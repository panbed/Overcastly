import { TriangleAlertIcon } from "lucide-react"

export default function ErrorPage( {errorMessage}: {errorMessage?: string} ) {
  return (
    <div className="flex flex-col items-center justify-center h-full">
      <TriangleAlertIcon className="size-1/12"/>
      <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
      Something went wrong.
      </h3>
      <p className="text-sm text-muted-foreground">{errorMessage}</p>
    </div>
  )
}