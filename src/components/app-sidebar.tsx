// components/app-sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";

import { RootState } from "@/store/store";
import {
  Home,
  Wand2,
  Sparkles,
  BarChart3,
  TrendingUp,
  Users,
  Settings,
  LogOut,
  ChevronUp,
  User2,
  CreditCard,
  Bell,
  Disc3,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const pathname = usePathname();
  const profile = useSelector((state: RootState) => state.user.profile);

  return (
    <Sidebar collapsible="icon">
      {/* Header: Logo or Brand Name */}
      <SidebarHeader className="h-16 border-b border-sidebar-border justify-center">
        <Link
          href="/"
          className="flex items-center gap-2 px-2 group-data-[collapsible=icon]:justify-center hover:opacity-80 transition-opacity"
        >
          <Disc3 className="h-7 w-7 text-light" />
          <span className="font-bold text-lg text-light group-data-[collapsible=icon]:hidden">
            Curatify
          </span>
        </Link>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent>
        {/* Dashboard */}
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard"}
                  tooltip="Dashboard"
                >
                  <Link href="/dashboard">
                    <Home />
                    <span>Dashboard</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Tools Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Tools</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/sorter"}
                  tooltip="Sorter"
                >
                  <Link href="/dashboard/sorter">
                    <Wand2 />
                    <span>Sorter</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/recommender"}
                  tooltip="Recommender"
                >
                  <Link href="/dashboard/recommender">
                    <Sparkles />
                    <span>Recommender</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Analytics Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Analytics</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/playlist-stats"}
                  tooltip="Playlist Stats"
                >
                  <Link href="/dashboard/playlist-stats">
                    <BarChart3 />
                    <span>Playlist Stats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/my-stats"}
                  tooltip="My Stats"
                >
                  <Link href="/dashboard/my-stats">
                    <TrendingUp />
                    <span>My Stats</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Friends Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Friends</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  isActive={pathname === "/dashboard/friends"}
                  tooltip="Friends"
                >
                  <Link href="/dashboard/friends">
                    <Users />
                    <span>Friends</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* 3. Footer: User Actions */}
      <SidebarFooter className="mb-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton>
                  {profile?.images?.[0]?.url ? (
                    <img
                      src={profile.images[0].url}
                      alt={profile.display_name || "Profile"}
                      className="h-8 w-8 rounded-full object-cover aspect-square shrink-0"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded-full bg-green/20 flex items-center justify-center text-green text-xs shrink-0">
                      👤
                    </div>
                  )}
                  <div className="flex-1 text-left group-data-[collapsible=icon]:hidden">
                    <p className="text-sm font-semibold">
                      {profile?.display_name || "User"}
                    </p>
                    <p className="text-xs text-light/60">{profile?.email}</p>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="w-72">
                {/* Header block */}
                <div className="flex items-center gap-3 p-3">
                  {profile?.images?.[0]?.url ? (
                    <img
                      src={profile.images[0].url}
                      alt={profile.display_name || "Profile"}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-green/20 flex items-center justify-center text-green">
                      👤
                    </div>
                  )}
                  <div className="min-w-0">
                    <p className="font-semibold truncate">
                      {profile?.display_name || "User"}
                    </p>
                    <p className="text-sm text-light/70 truncate">
                      {profile?.email || ""}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => {}}>
                  <Sparkles className="h-4 w-4" />
                  <span>Upgrade to Pro</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard/settings" className="cursor-pointer">
                    <User2 className="h-4 w-4" />
                    <span>Account</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <CreditCard className="h-4 w-4" />
                  <span>Billing</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => {}}>
                  <Bell className="h-4 w-4" />
                  <span>Notifications</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => console.log("Implement Logout logic here")}
                  className="text-pink hover:text-pink/90"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
