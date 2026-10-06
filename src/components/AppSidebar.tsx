import { Settings, LayoutDashboard, MapIcon, UserRound, CircleHelp, LogOutIcon, Users } from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Separator } from "@/components/ui/separator"
import { Link } from "react-router-dom"
import ProfilePicture from "./ProfilePicture"

// Menu items.
const mainItems = [
  {
    title: "Overview",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Map View",
    url: "/map",
    icon: MapIcon,
  },
  {
    title: "Social",
    url: "/posts",
    icon: Users,
  },
]

const otherItems = [
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
  // {
  //   title: "Help",
  //   url: "/help",
  //   icon: CircleHelp,
  // },
]

export default function AppSidebar() {
  return (
    <Sidebar collapsible="icon" >
      <SidebarContent>
        <SidebarGroup>  
          <SidebarGroupLabel>Overcastly</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <p>{item.title}</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
            <Separator className="my-4"/>
            <SidebarMenu>
              {otherItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <p>{item.title}</p>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
              <SidebarMenuItem >
                <SidebarMenuButton onClick={() => {localStorage.removeItem("userData"); window.location.href = "/login"}}>
                  <LogOutIcon />
                  <p>Logout</p>
                </SidebarMenuButton>
              </SidebarMenuItem>
          </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}
