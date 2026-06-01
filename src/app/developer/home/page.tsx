"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  RefreshCw,
  Calendar,
  TrendingUp,
  TrendingDown,
  Building2,
  FileText,
  Home,
  DollarSign,
  FolderOpen,
  Eye,
  Megaphone,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";

interface StatsCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
}

interface Booking {
  id: number;
  name: string;
  avatar: string;
  property: string;
  unit: string;
  lastUpdated: string;
  amount: string;
  status: string;
}

const statsCards: StatsCard[] = [
  {
    title: "Total Bookings",
    value: "247",
    change: "10% vs last 3 months",
    isPositive: true,
    icon: FileText,
  },
  {
    title: "Sales Offers",
    value: "78",
    change: "2% vs last 3 months",
    isPositive: false,
    icon: FileText,
  },
  {
    title: "Units Sold",
    value: "165",
    change: "5.6% vs last 3 months",
    isPositive: true,
    icon: Home,
  },
  {
    title: "Total Value",
    value: "425 M",
    change: "8% vs last 3 months",
    isPositive: true,
    icon: DollarSign,
  },
  {
    title: "Active Projects",
    value: "50",
    change: "10% vs last 3 months",
    isPositive: true,
    icon: FolderOpen,
  },
  {
    title: "Total Properties",
    value: "240",
    change: "2% vs last 3 months",
    isPositive: false,
    icon: Building2,
  },
  {
    title: "Total Views",
    value: "12,340",
    change: "5.6% vs last 3 months",
    isPositive: true,
    icon: Eye,
  },
  {
    title: "Featured Ads",
    value: "20",
    change: "8% vs last 3 months",
    isPositive: true,
    icon: Megaphone,
  },
];

const initialBookings: Booking[] = [
  {
    id: 1,
    name: "Jese Leos",
    avatar: "JL",
    property: "Gulf Tower",
    unit: "A-102",
    lastUpdated: "Last updated 22 Mar 2025",
    amount: "1,250,000 AED",
    status: "Pending",
  },
  {
    id: 2,
    name: "Jese Leos",
    avatar: "JL",
    property: "Gulf Tower",
    unit: "A-102",
    lastUpdated: "Last updated 22 Mar 2025",
    amount: "1,250,000 AED",
    status: "Pending",
  },
  {
    id: 3,
    name: "Jese Leos",
    avatar: "JL",
    property: "Gulf Tower",
    unit: "A-102",
    lastUpdated: "Last updated 22 Mar 2025",
    amount: "1,250,000 AED",
    status: "Pending",
  },
  {
    id: 4,
    name: "Jese Leos",
    avatar: "JL",
    property: "Gulf Tower",
    unit: "A-102",
    lastUpdated: "Last updated 22 Mar 2025",
    amount: "1,250,000 AED",
    status: "Pending",
  },
];

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState("Dec 31 - Jan 31");
  const [stats, setStats] = useState<StatsCard[]>(statsCards);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loading, setLoading] = useState(true);

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Dashboard overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Track progress across all sales stages
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 border-gray-200">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="icon" className="border-gray-200">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Dec 31 - Jan 31">Dec 31 - Jan 31</SelectItem>
              <SelectItem value="Last 7 days">Last 7 days</SelectItem>
              <SelectItem value="Last 30 days">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((card, index) => (
          <div
            key={index}
            className="bg-white rounded-lg border border-gray-200 p-4"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-gray-600">
                <card.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{card.title}</span>
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-3xl font-bold text-gray-900">
                {card.value}
              </div>
              <div
                className={`flex items-center gap-1 text-xs ${
                  card.isPositive ? "text-green-600" : "text-red-600"
                }`}
              >
                {card.isPositive ? (
                  <TrendingUp className="h-3 w-3" />
                ) : (
                  <TrendingDown className="h-3 w-3" />
                )}
                <span>{card.change}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Sales Stages Status Overview
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Track progress across all sales stages
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-around h-64 gap-3">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden h-40">
                  <div className="w-full bg-green-500 h-[40%]"></div>
                  <div className="w-full bg-cyan-400 h-[35%]"></div>
                  <div className="w-full bg-pink-500 h-[25%]"></div>
                </div>
                <span className="text-xs text-gray-600 mt-2 text-center">
                  Sales Purchase
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden h-48">
                  <div className="w-full bg-green-500 h-[50%]"></div>
                  <div className="w-full bg-cyan-400 h-[30%]"></div>
                  <div className="w-full bg-pink-500 h-[20%]"></div>
                </div>
                <span className="text-xs text-gray-600 mt-2 text-center">
                  Down Payment
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden h-32">
                  <div className="w-full bg-green-500 h-[35%]"></div>
                  <div className="w-full bg-cyan-400 h-[40%]"></div>
                  <div className="w-full bg-pink-500 h-[25%]"></div>
                </div>
                <span className="text-xs text-gray-600 mt-2 text-center">
                  Sales Offer
                </span>
              </div>

              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden h-56">
                  <div className="w-full bg-green-500 h-[45%]"></div>
                  <div className="w-full bg-cyan-400 h-[35%]"></div>
                  <div className="w-full bg-pink-500 h-[20%]"></div>
                </div>
                <span className="text-xs text-gray-600 mt-2 text-center">
                  Identification
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-6 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                <span className="text-xs text-gray-600">Completed</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                <span className="text-xs text-gray-600">In Progress</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                <span className="text-xs text-gray-600">Rejected</span>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Sales Stages
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Overview of all reservation statuses and types
              </p>
            </div>
            <Select defaultValue="last7">
              <SelectTrigger className="w-[130px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="last7">Last 7 days</SelectItem>
                <SelectItem value="last30">Last 30 days</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <div className="flex items-end justify-around h-64 gap-2">
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-teal-500 rounded-t-lg h-32"></div>
                <span className="text-xs text-gray-600 mt-2 text-center">
                  Sales Purchase
                </span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-cyan-400 rounded-t-lg h-48"></div>
                <span className="text-xs text-gray-600 mt-2 text-center">
                  Down Payment
                </span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-purple-500 rounded-t-lg h-36"></div>
                <span className="text-xs text-gray-600 mt-2 text-center">
                  Sales Offer
                </span>
              </div>
              <div className="flex-1 flex flex-col items-center">
                <div className="w-full bg-orange-400 rounded-t-lg h-56"></div>
                <span className="text-xs text-gray-600 mt-2 text-center">
                  Identification
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              In Progress Bookings
            </h3>
          </div>
          <Select defaultValue="stage">
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Stage Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stage">Stage Filter</SelectItem>
              <SelectItem value="all">All Stages</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className="flex items-center gap-4">
                <div className="h-10 w-10 rounded-full bg-pink-500 flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm font-medium">
                    {booking.avatar}
                  </span>
                </div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {booking.name}
                  </div>
                  <div className="text-sm text-gray-600">
                    {booking.property} - {booking.unit}
                  </div>
                  <div className="text-xs text-gray-500">
                    {booking.lastUpdated}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-6">
                <div className="text-right">
                  <div className="font-semibold text-gray-900">
                    {booking.amount}
                  </div>
                  <div className="text-sm text-orange-600">
                    {booking.status}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100">
          <Select defaultValue="last7days">
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7days">Last 7 days</SelectItem>
              <SelectItem value="last30days">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" className="gap-2 text-gray-600">
            View Bookings
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
