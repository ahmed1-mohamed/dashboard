"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  BarChart3,
  Settings,
  LogOut,
  FolderKanban,
  Shield,
  MessageSquare,
  Calendar,
  Activity,
  MapPin,
  Layers,
  Briefcase,
  Bell,
  Video,
  Star,
  Bot,
  ChevronDown,
  ChevronRight,
  FileText,
  Home,
} from "lucide-react";
import {
  FaMoneyBillWave,
  FaChalkboardTeacher,
  FaClipboardList,
} from "react-icons/fa";
import { TbSpeakerphone } from "react-icons/tb";
import { CiGift } from "react-icons/ci";

const developerMenuItems = [
  { icon: LayoutDashboard, label: "Home", href: "/developer/home" },
  { icon: FolderKanban, label: "My Projects", href: "/developer/projects" },
  { icon: Building2, label: "My Properties", href: "/developer/properties" },
  { icon: Calendar, label: "My Bookings", href: "/developer/bookings" },
  { icon: TbSpeakerphone, label: "Ads", href: "/developer/ads" },
  { icon: CiGift, label: "Offers", href: "/developer/offers" },
  { icon: DollarSign, label: "Transactions", href: "/developer/transactions" },
  {
    icon: FaClipboardList,
    label: "Market Place",
    href: "/developer/ready_market",
  },
];

const mainItems = [
  { icon: LayoutDashboard, label: "Dashboard", href: "/admin/home" },
  { icon: FolderKanban, label: "Projects", href: "/admin/projects" },
  { icon: Building2, label: "Properties", href: "/admin/properties" },
  { icon: Briefcase, label: "Developers", href: "/admin/developers" },
];

const expertMenuItems = [
  { icon: Home, label: "Home", href: "/expert/home" },
  { icon: Calendar, label: "Booking", href: "/expert/bookings" },
  { icon: FileText, label: "History", href: "/expert/history" },
  {
    icon: DollarSign,
    label: "Transactions",
    href: "/expert/transactions",
  },
  { icon: Settings, label: "Settings", href: "/expert/settings" },
];

const tabGroups = [
  {
    id: "users",
    label: "Users",
    items: [
      { icon: Users, label: "Users", href: "/admin/users" },
      { icon: Shield, label: "Roles", href: "/admin/roles" },
    ],
  },
  {
    id: "settings",
    label: "Settings",
    items: [
      { icon: Star, label: "Features", href: "/admin/features" },
      { icon: Layers, label: "Areas", href: "/admin/areas" },
      { icon: MapPin, label: "Locations", href: "/admin/locations" },
      { icon: MapPin, label: "Cities", href: "/admin/cities" },
    ],
  },
  {
    id: "custom_support",
    label: "Custom Support",
    items: [
      { icon: Activity, label: "Activity", href: "/admin/activity" },
      { icon: MessageSquare, label: "Chat", href: "/admin/chat" },
      { icon: Calendar, label: "Reservations", href: "/admin/bookings" },
      { icon: Video, label: "Meetings", href: "/admin/meetings" },
    ],
  },
];

const bottomItems = [
  { icon: Bell, label: "Notifications", href: "/admin/notifications" },
  {
    icon: FaMoneyBillWave,
    label: "Subscriptions",
    href: "/admin/subscriptions",
  },
  {
    icon: TbSpeakerphone,
    label: "Ads",
    href: "/admin/ads",
  },
  {
    icon: CiGift,
    label: "Offers",
    href: "/admin/offers",
  },
  {
    icon: FaChalkboardTeacher,
    label: "Experts",
    href: "/admin/experts",
  },
  {
    icon: FaClipboardList,
    label: "Ready Market",
    href: "/admin/ready_market",
  },
  { icon: FileText, label: "Reports", href: "/admin/reports" },
  { icon: Bot, label: "AI Assistant", href: "/admin/ai-assistant" },
  { icon: BarChart3, label: "Analytics", href: "/admin/analytics" },
  { icon: Settings, label: "Settings", href: "/admin/home" },
];

type SidebarItem = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  href: string;
};

type TabGroup = {
  id: string;
  label: string;
  items: SidebarItem[];
};

export function Sidebar({
  isOpen,
  setIsOpen
}: {
  isOpen?: boolean;
  setIsOpen?: (val: boolean) => void;
}) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const role_id = session?.user?.role_id as number | undefined;
  const [expandedTabs, setExpandedTabs] = useState<Record<string, boolean>>({
    users: true,
    settings: true,
    custom_support: true,
  });

  const isDeveloperRole = role_id === 3;

  const isAdminRole = role_id === 2;

  const isExpertRole = role_id === 6;
  const isTabActive = (group: TabGroup) => {
    return group.items.some(
      (item) => pathname === item.href || pathname.startsWith(item.href + "/"),
    );
  };

  const toggleTab = (tabId: string) => {
    setExpandedTabs((prev) => ({
      ...prev,
      [tabId]: !prev[tabId],
    }));
  };

  useEffect(() => {
    if (setIsOpen) {
      setIsOpen(false);
    }
  }, [pathname, setIsOpen]);

  return (
    <>
      {isOpen && setIsOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-0 z-40 h-screen transition-transform duration-300 ease-in-out",
          "w-64 border-r border-gray-200 bg-white",
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        <div className="flex h-full flex-col">
          {/* Logo/Brand */}
          <div className="flex h-16 items-center px-6 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-600">
                <Building2 className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">
                Property Adviser
              </span>
            </div>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-4">
            {isDeveloperRole && (
              <>
                <ul className="space-y-1">
                  {developerMenuItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-teal-50 text-teal-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 flex-shrink-0",
                              isActive
                                ? "text-teal-600"
                                : "text-gray-400 group-hover:text-gray-600",
                            )}
                          />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-6 rounded-lg bg-teal-600 p-4 text-white">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold">Current Plan</p>
                    <span className="rounded-full bg-purple-600 px-3 py-1 text-xs font-medium text-white">
                      Free
                    </span>
                  </div>
                  <div className="mb-2">
                    <p className="text-xs text-teal-100 mb-1">Credits</p>
                    <p className="text-lg font-bold">100 / 800</p>
                  </div>
                  <div className="mb-4">
                    <div className="h-2 w-full rounded-full bg-teal-800">
                      <div
                        className="h-2 rounded-full bg-white"
                        style={{ width: "12.5%" }}
                      />
                    </div>
                  </div>
                  <button className="w-full rounded-lg bg-white px-3 py-2 text-sm font-semibold text-teal-600 transition-colors hover:bg-gray-100">
                    Upgrade
                  </button>
                </div>
              </>
            )}

            {isAdminRole && (
              <>
                <ul className="space-y-1">
                  {mainItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-teal-50 text-teal-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 flex-shrink-0",
                              isActive
                                ? "text-teal-600"
                                : "text-gray-400 group-hover:text-gray-600",
                            )}
                          />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>

                <div className="mt-4 space-y-2">
                  {tabGroups.map((group) => {
                    const isExpanded = expandedTabs[group.id];
                    const isActive = isTabActive(group);

                    return (
                      <div key={group.id}>
                        <button
                          onClick={() => toggleTab(group.id)}
                          className={cn(
                            "group flex w-full items-center justify-between rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-teal-50 text-teal-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                          )}
                        >
                          <span>{group.label}</span>
                          {isExpanded ? (
                            <ChevronDown className="h-4 w-4" />
                          ) : (
                            <ChevronRight className="h-4 w-4" />
                          )}
                        </button>

                        {/* Tab Items - Collapsible */}
                        {isExpanded && (
                          <ul className="mt-1 space-y-1 pl-4">
                            {group.items.map((item) => {
                              const isActive =
                                pathname === item.href ||
                                pathname.startsWith(item.href + "/");
                              return (
                                <li key={item.href}>
                                  <Link
                                    href={item.href}
                                    className={cn(
                                      "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                      isActive
                                        ? "bg-teal-50 text-teal-600"
                                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                                    )}
                                  >
                                    <item.icon
                                      className={cn(
                                        "h-5 w-5 flex-shrink-0",
                                        isActive
                                          ? "text-teal-600"
                                          : "text-gray-400 group-hover:text-gray-600",
                                      )}
                                    />
                                    <span>{item.label}</span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* Bottom Items - Always Visible */}
                <ul className="mt-4 space-y-1 border-t border-gray-200 pt-4">
                  {bottomItems.map((item) => {
                    const isActive =
                      pathname === item.href ||
                      pathname.startsWith(item.href + "/");
                    return (
                      <li key={item.href}>
                        <Link
                          href={item.href}
                          className={cn(
                            "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                            isActive
                              ? "bg-teal-50 text-teal-600"
                              : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                          )}
                        >
                          <item.icon
                            className={cn(
                              "h-5 w-5 flex-shrink-0",
                              isActive
                                ? "text-teal-600"
                                : "text-gray-400 group-hover:text-gray-600",
                            )}
                          />
                          <span>{item.label}</span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </>
            )}

            {isExpertRole && (
              <ul className="space-y-1">
                {expertMenuItems.map((item) => {
                  const isActive =
                    pathname === item.href ||
                    pathname.startsWith(item.href + "/");

                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        className={cn(
                          "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                          isActive
                            ? "bg-teal-50 text-teal-600"
                            : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                        )}
                      >
                        <item.icon
                          className={cn(
                            "h-5 w-5",
                            isActive
                              ? "text-teal-600"
                              : "text-gray-400 group-hover:text-gray-600",
                          )}
                        />
                        <span>{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </nav>

          <div className="border-t border-gray-200 p-4">
            <button
              onClick={() => signOut({ callbackUrl: "/auth/signin" })}
              className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut className="h-5 w-5 text-gray-400 group-hover:text-gray-600" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
