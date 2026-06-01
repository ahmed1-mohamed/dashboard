"use client";

import { use, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchExpertDetails } from "@/data/api-client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { EditExpertModal } from "@/components/modals/edit-expert-modal";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Globe,
  Star,
  Calendar,
  Briefcase,
  MapPin,
  MessageSquare,
  FileText,
  Edit,
  Download,
  User,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

interface ExpertLanguage {
  language_id: number;
  name: string;
  code: string;
  pivot: { expert_id: number; language_id: number };
}

interface ExpertCountry {
  id: number;
  name: string;
  pivot: { expert_id: number; country_id: number };
}

interface ExpertCategory {
  category_id: number;
  code: string;
  name: string;
  pivot: { expert_id: number; category_id: number };
}

interface ExpertCertification {
  cert_name: string;
}

interface ExpertExperience {
  id: number;
  expert_id: number;
  cert_name: string;
}

interface ExpertUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_picture: string | null;
}

interface ExpertDetail {
  expert_id: number;
  user_id: number;
  status: string;
  display_name: string;
  title: string | null;
  bio: string;
  years_experience: number;
  certifications: ExpertCertification[];
  website: string;
  linkedin: string;
  rate_per_30min_cents: number;
  currency: string;
  languages: ExpertLanguage[];
  rating_avg: string;
  rating_count: number;
  photo_url: string | null;
  podcast: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  consultions: number;
  user: ExpertUser;
  countries: ExpertCountry[];
  categories: ExpertCategory[];
  availability_rules: unknown[];
  availability_exceptions: unknown[];
  packages: unknown[];
  wallet: unknown | null;
  reviews: unknown[];
  bookings: unknown[];
  experiences: ExpertExperience[];
}

interface ApiResponse {
  status: boolean;
  message: string;
  data: ExpertDetail;
}

export default function ExpertDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: expertId } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("overview");
  const [isActive, setIsActive] = useState(true);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [processingBookingId, setProcessingBookingId] = useState<number | null>(
    null,
  );

  const {
    data: apiResponse,
    isLoading,
    isError,
    error,
  } = useQuery<ApiResponse>({
    queryKey: ["expertDetails", expertId],
    queryFn: () => fetchExpertDetails(Number(expertId), token!),
    enabled: !!token,
  });

  const { data: reviewsData, isLoading: loadingReviews } = useQuery({
    queryKey: ["expertReviews", expertId],
    queryFn: async () => {
      if (!token || !expertId) throw new Error("Not authenticated");
      const response = await fetch(
        `https://demoapi.p-adviser.com/api/dashboard/experts/${expertId}/reviews`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch reviews");
      return response.json();
    },
    enabled: !!token && !!expertId && activeTab === "reviews",
    staleTime: Infinity,
  });

  const { data: transactionsData, isLoading: loadingTransactions } = useQuery({
    queryKey: ["expertTransactions", expertId],
    queryFn: async () => {
      if (!token || !expertId) throw new Error("Not authenticated");
      const response = await fetch(
        `https://demoapi.p-adviser.com/api/dashboard/experts/${expertId}/transactions`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch transactions");
      return response.json();
    },
    enabled: !!token && !!expertId && activeTab === "transactions",
    staleTime: Infinity,
  });

  const { data: bookingsData, isLoading: loadingBookings } = useQuery({
    queryKey: ["expertBookings", expertId],
    queryFn: async () => {
      if (!token || !expertId) throw new Error("Not authenticated");
      const response = await fetch(
        `https://demoapi.p-adviser.com/api/dashboard/experts/${expertId}/bookings`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to fetch bookings");
      return response.json();
    },
    enabled: !!token && !!expertId && activeTab === "upcoming-meetings",
    staleTime: Infinity,
  });

  const expert = apiResponse?.data;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getRatingColor = (rating: string | number) => {
    const num = typeof rating === "string" ? parseFloat(rating) : rating;
    if (num >= 4) return "text-green-600";
    if (num >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getRatingBg = (rating: string | number) => {
    const num = typeof rating === "string" ? parseFloat(rating) : rating;
    if (num >= 4) return "bg-green-50 border-green-200";
    if (num >= 3) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      approved: "bg-green-50 text-green-700 border-green-200",
      pending: "bg-yellow-50 text-yellow-700 border-yellow-200",
      rejected: "bg-red-50 text-red-700 border-red-200",
    };
    return (
      <Badge
        className={`${
          styles[status] || "bg-gray-50 text-gray-700 border-gray-200"
        } border text-xs capitalize`}
      >
        {status}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString.replace(" ", "T"));
    if (isNaN(date.getTime())) return "N/A";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const confirmBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const response = await fetch(
        `https://demoapi.p-adviser.com/api/dashboard/experts/bookings/${bookingId}/confirm`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to confirm booking");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Booking confirmed successfully");
      setProcessingBookingId(null);
      queryClient.invalidateQueries({ queryKey: ["expertBookings", expertId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to confirm booking");
      setProcessingBookingId(null);
    },
  });

  const declineBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const response = await fetch(
        `https://demoapi.p-adviser.com/api/dashboard/experts/bookings/${bookingId}/decline`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to decline booking");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Booking declined successfully");
      setProcessingBookingId(null);
      queryClient.invalidateQueries({ queryKey: ["expertBookings", expertId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to decline booking");
      setProcessingBookingId(null);
    },
  });

  const rescheduleBookingMutation = useMutation({
    mutationFn: async (bookingId: number) => {
      const response = await fetch(
        `https://demoapi.p-adviser.com/api/dashboard/experts/bookings/${bookingId}/reschedule`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      if (!response.ok) throw new Error("Failed to reschedule booking");
      return response.json();
    },
    onSuccess: () => {
      toast.success("Booking rescheduled successfully");
      setProcessingBookingId(null);
      queryClient.invalidateQueries({ queryKey: ["expertBookings", expertId] });
    },
    onError: (error: Error) => {
      toast.error(error.message || "Failed to reschedule booking");
      setProcessingBookingId(null);
    },
  });

  const handleConfirm = (bookingId: number) => {
    confirmBookingMutation.mutate(bookingId);
  };

  const handleDecline = (bookingId: number) => {
    declineBookingMutation.mutate(bookingId);
  };

  const handleReschedule = (bookingId: number) => {
    rescheduleBookingMutation.mutate(bookingId);
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">
            Loading expert details...
          </p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  }

  if (!expert) {
    return (
      <div className="p-4 text-center text-gray-500">No data available</div>
    );
  }

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Home</span>
        <ChevronRight className="h-4 w-4" />
        <span>Experts</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">{expert.display_name}</span>
      </div>

      {/* Header with Back Button */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/experts")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Expert Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2">
            <Phone className="h-4 w-4" />
            Contact
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
        </div>
      </div>

      {/* Expert Header Card */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-full bg-teal-500 flex items-center justify-center text-xl font-bold text-white flex-shrink-0">
              {getInitials(expert.display_name)}
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-gray-900">
                  {expert.display_name}
                </h2>
                {getStatusBadge(expert.status)}
              </div>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <div className="flex items-center gap-1">
                  <Mail className="h-4 w-4 text-gray-400" />
                  {expert.user.email}
                </div>
                <div className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-gray-400" />
                  {expert.user.phone_number}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Consultations</p>
            <p className="text-2xl font-bold text-gray-900">
              {expert.consultions}
            </p>
          </div>
          <div
            className={`p-4 rounded-lg border ${getRatingBg(expert.rating_avg)}`}
          >
            <p className="text-sm text-gray-600 mb-1">Rating</p>
            <div className="flex items-center gap-1">
              <Star
                className={`h-5 w-5 ${getRatingColor(expert.rating_avg)}`}
                fill="currentColor"
              />
              <p
                className={`text-2xl font-bold ${getRatingColor(expert.rating_avg)}`}
              >
                {parseFloat(expert.rating_avg).toFixed(1)}
              </p>
              <span className="text-sm text-gray-400 ml-1">
                ({expert.rating_count})
              </span>
            </div>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Countries</p>
            <p className="text-2xl font-bold text-gray-900">
              {expert.countries.length}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Member Since</p>
            <p className="text-sm font-semibold text-gray-900 mt-1">
              {formatDate(expert.created_at)}
            </p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Contact & Info */}
        <div className="space-y-6">
          {/* Contact Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Information
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Name</span>
                <span className="text-sm text-gray-900 font-medium">
                  {expert.user.first_name} {expert.user.last_name}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Email</span>
                <span className="text-sm text-gray-900 font-medium">
                  {expert.user.email || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Phone</span>
                <span className="text-sm text-gray-900 font-medium">
                  {expert.user.phone_number || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Title</span>
                <span className="text-sm text-gray-900 font-medium">
                  {expert.title || "N/A"}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={isActive}
                    onCheckedChange={setIsActive}
                    className="data-[state=checked]:bg-green-600 data-[state=unchecked]:bg-gray-300"
                  />
                  <span className="text-sm text-gray-900 font-medium">
                    {isActive ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Specializations */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Specializations
            </h3>
            <div className="flex flex-wrap gap-2">
              {expert.categories.length > 0 ? (
                expert.categories.map((category, index) => (
                  <Badge
                    key={index}
                    variant="outline"
                    className="bg-teal-50 text-teal-700 border-teal-200"
                  >
                    {category.name}
                  </Badge>
                ))
              ) : (
                <span className="text-sm text-gray-400">
                  No specializations listed
                </span>
              )}
            </div>
          </div>

          {/* Countries */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Countries
            </h3>
            <div className="space-y-2">
              {expert.countries.length > 0 ? (
                expert.countries.map((country, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <Globe className="h-4 w-4 text-gray-400" />
                    {country.name}
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-400">
                  No countries listed
                </span>
              )}
            </div>
          </div>

          {/* Experience */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Experience
            </h3>
            <div className="space-y-2">
              {expert.experiences.length > 0 ? (
                expert.experiences.map((exp, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-sm text-gray-700"
                  >
                    <Briefcase className="h-4 w-4 text-gray-400" />
                    {exp.cert_name}
                  </div>
                ))
              ) : (
                <span className="text-sm text-gray-400">
                  No experience listed
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Column - Tabs Content */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg border border-gray-200">
            {/* Navigation Bar */}
            <div className="border-b border-gray-200 bg-white">
              <div className="flex overflow-x-auto">
                {[
                  { id: "overview", label: "Overview", icon: User },
                  { id: "reviews", label: "Reviews", icon: Star },
                  { id: "transactions", label: "Transactions", icon: FileText },
                  {
                    id: "upcoming-meetings",
                    label: "Upcoming Meetings",
                    icon: Calendar,
                  },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-4 text-sm font-medium whitespace-nowrap transition-all border-b-2 ${
                      activeTab === tab.id
                        ? "border-teal-600 text-teal-600 bg-teal-50/50"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                    }`}
                  >
                    <tab.icon
                      className={`h-4 w-4 ${
                        activeTab === tab.id ? "text-teal-600" : "text-gray-400"
                      }`}
                    />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {activeTab === "overview" && (
                <div className="space-y-6">
                  {/* Profile Summary */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Profile Summary
                    </h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MessageSquare className="h-4 w-4 text-teal-600" />
                          <span className="text-sm text-gray-600">
                            Total Consultations
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {expert.consultions}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Star className="h-4 w-4 text-teal-600" />
                          <span className="text-sm text-gray-600">
                            Average Rating
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {parseFloat(expert.rating_avg).toFixed(1)}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <MapPin className="h-4 w-4 text-teal-600" />
                          <span className="text-sm text-gray-600">
                            Countries Served
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {expert.countries.length}
                        </p>
                      </div>
                      <div className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Briefcase className="h-4 w-4 text-teal-600" />
                          <span className="text-sm text-gray-600">
                            Specializations
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-gray-900">
                          {expert.categories.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Rating Breakdown */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Rating Overview
                    </h4>
                    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <p className="text-4xl font-bold text-gray-900">
                          {parseFloat(expert.rating_avg).toFixed(1)}
                        </p>
                        <div className="flex items-center gap-0.5 mt-1 justify-center">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`h-4 w-4 ${
                                star <=
                                Math.round(parseFloat(expert.rating_avg))
                                  ? "text-yellow-400 fill-yellow-400"
                                  : "text-gray-300"
                              }`}
                            />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {expert.rating_count} review
                          {expert.rating_count !== 1 ? "s" : ""}
                        </p>
                      </div>
                      <div className="flex-1 space-y-1.5">
                        {[5, 4, 3, 2, 1].map((rating) => {
                          const percentage =
                            rating <= Math.round(parseFloat(expert.rating_avg))
                              ? rating ===
                                Math.round(parseFloat(expert.rating_avg))
                                ? 70
                                : 20
                              : 5;
                          return (
                            <div
                              key={rating}
                              className="flex items-center gap-2"
                            >
                              <span className="text-xs text-gray-500 w-3">
                                {rating}
                              </span>
                              <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                              <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{ width: `${percentage}%` }}
                                />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>

                  {/* Account Info */}
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Account Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">Expert ID</span>
                        <span className="text-sm text-gray-900 font-medium">
                          #{expert.expert_id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">User ID</span>
                        <span className="text-sm text-gray-900 font-medium">
                          #{expert.user_id}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <span className="text-sm text-gray-600">
                          Member Since
                        </span>
                        <span className="text-sm text-gray-900 font-medium">
                          {formatDate(expert.created_at)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-600">Status</span>
                        {getStatusBadge(expert.status)}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "reviews" && (
                <div className="space-y-4">
                  {loadingReviews ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
                    </div>
                  ) : reviewsData?.data && reviewsData.data.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {parseFloat(expert?.rating_avg || "0").toFixed(1)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Average Rating
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {reviewsData.data.length}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Total Reviews
                          </p>
                        </div>
                      </div>
                      <div className="divide-y divide-gray-100">
                        {reviewsData.data.map((review: any, index: number) => (
                          <div key={index} className="py-4">
                            <div className="flex items-start justify-between">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                                  {review.customer?.first_name?.charAt(0) ||
                                    "U"}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">
                                    {review.customer?.first_name}{" "}
                                    {review.customer?.last_name}
                                  </p>
                                  <p className="text-sm text-gray-500">
                                    {formatDate(review.created_at)}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <Star
                                    key={star}
                                    className={`h-4 w-4 ${
                                      star <= review.rating
                                        ? "text-yellow-400 fill-yellow-400"
                                        : "text-gray-300"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            {review.comment && (
                              <p className="mt-3 text-sm text-gray-600">
                                {review.comment}
                              </p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Star className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Reviews & Ratings
                      </h3>
                      <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
                        No reviews yet for this expert.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "transactions" && (
                <div className="space-y-4">
                  {loadingTransactions ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
                    </div>
                  ) : transactionsData?.data &&
                    transactionsData.data.length > 0 ? (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {expert?.consultions || 0}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Total Consultations
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            $
                            {(
                              (expert?.rate_per_30min_cents || 0) / 100
                            ).toFixed(2)}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Rate per 30min
                          </p>
                        </div>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                ID
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Client
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Package
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Action
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Amount
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Date
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-100">
                            {transactionsData.data.map(
                              (transaction: any, index: number) => (
                                <tr key={index}>
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    #{transaction.tx_id}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    {transaction.client_name || "N/A"}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {transaction.package_name || "N/A"}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600">
                                    {transaction.action?.replace(/_/g, " ") ||
                                      "N/A"}
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900">
                                    {transaction.amount_cents
                                      ? `$${(transaction.amount_cents / 100).toFixed(2)}`
                                      : transaction.minutes
                                        ? `${transaction.minutes} min`
                                        : "-"}
                                  </td>
                                  <td className="px-4 py-3">
                                    <Badge
                                      className={
                                        transaction.status === "confirmed" ||
                                        transaction.status === "completed"
                                          ? "bg-green-100 text-green-800"
                                          : transaction.status === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : transaction.status === "ongoing"
                                              ? "bg-blue-100 text-blue-800"
                                              : "bg-gray-100 text-gray-800"
                                      }
                                    >
                                      {transaction.status}
                                    </Badge>
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-500">
                                    {transaction.transaction_date
                                      ? formatDate(transaction.transaction_date)
                                      : "N/A"}
                                  </td>
                                </tr>
                              ),
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <FileText className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Transaction History
                      </h3>
                      <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
                        No transactions yet for this expert.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "upcoming-meetings" && (
                <div className="space-y-4">
                  {loadingBookings ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
                    </div>
                  ) : bookingsData?.data && bookingsData.data.length > 0 ? (
                    <div>
                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {bookingsData.data.length}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Total Bookings
                          </p>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-lg text-center">
                          <p className="text-2xl font-bold text-gray-900">
                            {
                              bookingsData.data.filter(
                                (b: any) =>
                                  new Date(b.start_time) >= new Date(),
                              ).length
                            }
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            Upcoming Meetings
                          </p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {bookingsData.data.map(
                          (booking: any, index: number) => (
                            <div
                              key={index}
                              className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-teal-600 font-semibold">
                                    {booking.customer?.first_name?.charAt(0) ||
                                      "C"}
                                  </div>
                                  <div>
                                    <p className="font-medium text-gray-900">
                                      {booking.customer?.first_name}{" "}
                                      {booking.customer?.last_name}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {booking.customer?.email}
                                    </p>
                                  </div>
                                </div>
                                <Badge
                                  className={
                                    booking.status === "confirmed"
                                      ? "bg-green-100 text-green-800"
                                      : booking.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : booking.status === "completed"
                                          ? "bg-blue-100 text-blue-800"
                                          : booking.status === "cancelled"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-800"
                                  }
                                >
                                  {booking.status}
                                </Badge>
                              </div>

                              <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Calendar className="h-4 w-4 text-gray-400" />
                                  <span>
                                    {booking.start_time
                                      ? formatDate(booking.start_time)
                                      : "N/A"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  <span>
                                    {booking.minutes
                                      ? `${booking.minutes} min`
                                      : "-"}
                                  </span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <FileText className="h-4 w-4 text-gray-400" />
                                  <span>
                                    {booking.meeting_provider || "N/A"}
                                  </span>
                                </div>
                              </div>

                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                  disabled={
                                    processingBookingId === booking.booking_id
                                  }
                                  onClick={() =>
                                    handleConfirm(booking.booking_id)
                                  }
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 border-red-200 text-red-600 hover:bg-red-50"
                                  disabled={
                                    processingBookingId === booking.booking_id
                                  }
                                  onClick={() =>
                                    handleDecline(booking.booking_id)
                                  }
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Decline
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="flex-1 border-gray-200 text-gray-600 hover:bg-gray-50"
                                  disabled={
                                    processingBookingId === booking.booking_id
                                  }
                                  onClick={() =>
                                    handleReschedule(booking.booking_id)
                                  }
                                >
                                  <Clock className="h-4 w-4 mr-1" />
                                  Reschedule
                                </Button>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Calendar className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        Upcoming Meetings
                      </h3>
                      <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
                        No bookings yet for this expert.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* <EditExpertModal
        expertId={expert ? Number(expert.expert_id) : null}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      /> */}
    </div>
  );
}
