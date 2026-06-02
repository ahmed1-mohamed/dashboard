"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import {
  Menu,
  Search,
  Plus,
  MessageSquare,
  Globe,
  Bell,
  ChevronDown,
  User,
  Moon,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  const [darkMode, setDarkMode] = useState(false);
  const { data: session } = useSession();

  const user = session?.user;
  const userName = user?.name || "User";
  const userEmail = user?.email || "";
  const userInitial = userName.charAt(0).toUpperCase();
  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-6">
      {/* Left Section - Hamburger & Search */}
      <div className="flex items-center gap-4 flex-1">
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-gray-600 lg:hidden"
          onClick={onMenuClick}
        >
          <Menu className="h-5 w-5" />
          <span className="sr-only">Toggle menu</span>
        </Button>

        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="search"
            placeholder="Search"
            className="pl-10 bg-gray-50 border-gray-200 h-9 text-sm"
          />
        </div>
      </div>

      {/* Right Section - Actions & Profile */}
      <div className="flex items-center gap-3">
        {/* Create Button */}
        <Button className="bg-teal-600 hover:bg-teal-700 text-white h-9 px-4 gap-2">
          <Plus className="h-4 w-4" />
          Create
        </Button>

        {/* Icon Buttons */}
        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600">
          <MessageSquare className="h-5 w-5" />
          <span className="sr-only">Messages</span>
        </Button>

        <Button variant="ghost" size="icon" className="h-9 w-9 text-gray-600">
          <Globe className="h-5 w-5" />
          <span className="sr-only">Language</span>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 text-gray-600 relative"
        >
          <Bell className="h-5 w-5" />
          <span className="sr-only">Notifications</span>
        </Button>

        {/* User Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-2 hover:bg-gray-50 rounded-lg px-2 py-1.5 transition-colors outline-none max-w-[150px] sm:max-w-none">
              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {userInitial}
                </span>
              </div>
              <span className="text-sm font-medium text-gray-900 truncate hidden sm:inline-block">
                {userName}
              </span>
              <ChevronDown className="h-4 w-4 text-gray-600 flex-shrink-0" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[280px] p-0">
            {/* User Info */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-sm font-medium">
                  {userInitials}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <div className="font-medium text-gray-900 text-sm">
                  {userName}
                </div>
                <div className="text-xs text-gray-500 truncate">
                  {userEmail}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <div className="py-2">
              <DropdownMenuItem className="px-4 py-2.5 cursor-pointer">
                <User className="h-4 w-4 mr-3 text-gray-600" />
                <span className="text-sm text-gray-900">Account Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="px-4 py-2.5 cursor-pointer"
                onSelect={(e) => {
                  e.preventDefault();
                  setDarkMode(!darkMode);
                }}
              >
                <Moon className="h-4 w-4 mr-3 text-gray-600" />
                <span className="text-sm text-gray-900 flex-1">Dark mode</span>
                <Switch
                  checked={darkMode}
                  onCheckedChange={setDarkMode}
                  className="ml-auto"
                />
              </DropdownMenuItem>
            </div>

            <DropdownMenuSeparator className="my-0" />

            {/* Sign Out */}
            <div className="py-2">
              <DropdownMenuItem
                onClick={async () => {
                  // امسح cookies manual
                  document.cookie =
                    "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00";
                  document.cookie =
                    "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00";

                  await signOut({ callbackUrl: "/auth/signin" });
                }}
                className="px-4 py-2.5 cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
              >
                <LogOut className="h-4 w-4 mr-3" />
                <span className="text-sm font-medium">Sign out</span>
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
