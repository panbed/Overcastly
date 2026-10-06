import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { Outlet } from "react-router-dom"
import AppSidebar from "./AppSidebar"
import TopBar from "./TopBar"
import { useState } from "react"

// TODO

export default function Dashboard() {
  const [open, setOpen] = useState(false);

  return (
    <SidebarProvider open={open} onOpenChange={setOpen}>
      <AppSidebar />
      <div className="flex flex-col flex-1">
        <TopBar />
        <main>
          <Outlet />
        </main>
      </div>
    </SidebarProvider>
  )
}