"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchDashboardStats, fetchBookings, fetchDashboardCharts, fetchDashboardReviews } from "@/data/api-client";
import { BookingDataType } from "@/types";
import { DashboardHeader } from "./components/DashboardHeader";
import { StatsCards } from "./components/StatsCards";
import { ChartsSection } from "./components/ChartsSection";
import { BookingsSection } from "./components/BookingsSection";
import Reviews from "@/components/dashboardExperts/Reviews/Review";
import { bookingsExportToExcel } from "@/lib/handle-export";
import { type Booking, type StatsCard } from "./types";
import {
  FileText,
  Home,
  DollarSign,
  FolderOpen,
  Building2,
  Eye,
  Megaphone,
} from "lucide-react";

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
    status: "Sales Offer",
  },
  {
    id: 2,
    name: "Jese Leos",
    avatar: "JL",
    property: "Gulf Tower",
    unit: "A-102",
    lastUpdated: "Last updated 22 Mar 2025",
    amount: "1,250,000 AED",
    status: "Down payment",
  },
  {
    id: 3,
    name: "Jese Leos",
    avatar: "JL",
    property: "Gulf Tower",
    unit: "A-102",
    lastUpdated: "Last updated 22 Mar 2025",
    amount: "1,250,000 AED",
    status: "Sales Purchase",
  },
  {
    id: 4,
    name: "Jese Leos",
    avatar: "JL",
    property: "Gulf Tower",
    unit: "A-102",
    lastUpdated: "Last updated 22 Mar 2025",
    amount: "1,250,000 AED",
    status: "Identification",
  },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const [dateRange, setDateRange] = useState("Dec 31 - Jan 31");
  const [stats, setStats] = useState<StatsCard[]>(statsCards);
  const [bookings, setBookings] = useState<Booking[]>(initialBookings);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);
  const [reviewsData, setReviewsData] = useState<any>(null);

  const loadDashboardData = async () => {
    setLoading(true);
    if (session?.user?.accessToken) {
      try {
        const token = session.user.accessToken;
        const [chartsResponse, reviewsResponse] = await Promise.all<any>([
          fetchDashboardCharts(token).catch((err: any) => {
            console.error("Failed to fetch dashboard charts", err);
            return null;
          }),
          fetchDashboardReviews(token).catch((err: any) => {
            console.error("Failed to fetch dashboard reviews", err);
            return null;
          }),
        ]);

        console.log("Dashboard Charts API Response:", chartsResponse);
        console.log("Dashboard Reviews API Response:", reviewsResponse);

        if (chartsResponse?.data) {
          setChartData(chartsResponse.data);
        } else {
          setChartData(chartsResponse);
        }

        if (reviewsResponse?.data) {
          setReviewsData(reviewsResponse.data);
        } else {
          setReviewsData(reviewsResponse);
        }
      } catch (err) {
        console.error("Failed to load dashboard api data", err);
      }
    } else {
      // Simulate delay if no session
      await new Promise((resolve) => setTimeout(resolve, 500));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadDashboardData();
  }, [session]);

  const handleExport = () => {
    bookingsExportToExcel(bookings);
  };

  const handleRefresh = () => {
    loadDashboardData();
  };

  return (
    <div className="p-6 space-y-6 max-w-full overflow-hidden">
      <DashboardHeader
        dateRange={dateRange}
        setDateRange={setDateRange}
        onExport={handleExport}
        onRefresh={handleRefresh}
        isRefreshing={loading}
      />
      <StatsCards stats={stats} />
      <ChartsSection />
      <BookingsSection bookings={bookings} />

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Recent Reviews
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Latest feedback from users
          </p>
        </div>
        <Reviews
          limit={5}
          reviewsData={reviewsData}
          isLoading={loading}
          cardClassName="bg-gray-50 border border-gray-100 rounded-xl"
        />
      </div>
    </div>
  );
}
