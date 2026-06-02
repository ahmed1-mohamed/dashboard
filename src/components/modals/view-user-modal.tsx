"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchUsersDetails } from "@/data/api-client";
import {
  Eye,
  Edit2,
  Trash2,
  Mail,
  User,
  Shield,
  Phone,
  Calendar,
} from "lucide-react";

interface UserData {
  user_id: number;
  name: string;
  profile_picture: string;
  role_name: string;
  email: string;
  lastLogin: string;
  status: "Active" | "Inactive" | "Suspended";
}

interface ViewUserModalProps {
  userId: number | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

interface UserDetailResponse {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  profile_picture: string | null;
  status: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  role_id: number;
  verification: string;
  role: {
    role_id: number;
    role_name: string;
    role_type: string;
    description: string | null;
    is_active: boolean;
  };
  addresses: unknown[];
  user_developer_relationship: unknown | null;
  subscriptions: unknown[];
}

const roleColors: Record<string, string> = {
  Admin: "bg-cyan-100 text-cyan-800",
  Viewer: "bg-gray-100 text-gray-800",
  Editor: "bg-purple-100 text-purple-800",
  user: "bg-blue-100 text-blue-800",
};

const statusColors: Record<string, string> = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-red-100 text-red-800",
  suspended: "bg-yellow-100 text-yellow-800",
};

export function ViewUserModal({
  userId,
  isOpen,
  onClose,
  onEdit,
  onDelete,
}: ViewUserModalProps) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const { data: userData, isLoading } = useQuery<any>({
    queryKey: ["userDetails", userId],
    queryFn: () => fetchUsersDetails(userId!, token!),
    enabled: !!userId && !!token && isOpen,
    select: (response: any) => {
      if (response?.data && response.data.user_id) {
        return response.data as UserDetailResponse;
      }
      return (response?.data || response) as UserDetailResponse;
    },
  });
  const user = userData;
  console.log(user);
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };
  if (!isOpen || !userId) return null;
  const getInitials = (firstName: string, lastName: string) => {
    const first = firstName?.charAt(0) || "";
    const last = lastName?.charAt(0) || "";
    return `${first}${last}`.toUpperCase() || "U";
  };
  const avatarColors = [
    "bg-pink-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-indigo-500",
    "bg-red-500",
    "bg-cyan-500",
  ];
  const getAvatarColor = (name: string) => {
    const index = name?.charCodeAt(0) || 0 % avatarColors.length;
    return avatarColors[index];
  };
  const userName = user
    ? `${user.first_name} ${user.last_name}`.trim()
    : "User";
  if (isLoading) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="md">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">
              Loading user details...
            </p>
          </div>
        </div>
      </Modal>
    );
  }
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="xl">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {user?.profile_picture ? (
              <img
                src={user.profile_picture}
                alt={userName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div
                className={`w-12 h-12 rounded-full ${getAvatarColor(
                  userName,
                )} flex items-center justify-center text-white font-semibold`}
              >
                {getInitials(user?.first_name || "", user?.last_name || "")}
              </div>
            )}
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {userName}
              </h3>
              <p className="text-sm text-gray-500">ID: {user?.user_id}</p>
            </div>
          </div>
          <Badge
            className={
              statusColors[user?.status || ""] || "bg-gray-100 text-gray-800"
            }
          >
            {user?.status || "N/A"}
          </Badge>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Mail className="w-4 h-4" />
              <span className="text-sm">Email</span>
            </div>
            <p className="font-medium text-gray-900">{user?.email || "N/A"}</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Phone className="w-4 h-4" />
              <span className="text-sm">Phone Number</span>
            </div>
            <p className="font-medium text-gray-900">
              {user?.phone_number || "N/A"}
            </p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Shield className="w-4 h-4" />
              <span className="text-sm">Role</span>
            </div>
            <Badge
              className={
                roleColors[user?.role?.role_name || ""] || roleColors.Viewer
              }
            >
              {user?.role?.role_name || "N/A"}
            </Badge>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <span className="text-sm">Verification</span>
            </div>
            <Badge className="bg-blue-100 text-blue-800">
              {user?.email || "N/A"}
            </Badge>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-2 text-gray-500 mb-1">
              <Calendar className="w-4 h-4" />
              <span className="text-sm">Member Since</span>
            </div>
            <p className="font-medium text-gray-900">
              {formatDate(user?.created_at || null)}
            </p>
          </div>

          {user?.subscriptions && user.subscriptions.length > 0 && (
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 text-gray-500 mb-2">
                <Shield className="w-4 h-4" />
                <span className="text-sm">Subscriptions</span>
              </div>
              <div className="space-y-3">
                {user.subscriptions.map((sub: any) => (
                  <div key={sub.subscription_id} className="bg-white p-3 rounded border border-gray-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-gray-900">{sub.plan?.name || "Plan"}</span>
                      <Badge className={sub.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}>
                        {sub.status}
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500">{sub.plan?.description}</p>
                    {sub.current_period_start && sub.current_period_end && (
                      <div className="mt-2 text-xs text-gray-500">
                        Valid: {formatDate(sub.current_period_start)} - {formatDate(sub.current_period_end)}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex gap-3 justify-end pt-4 border-t">
          <Button
            variant="outline"
            onClick={onDelete}
            className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Delete
          </Button>
          <Button
            onClick={onEdit}
            className="bg-teal-600 hover:bg-teal-700 text-white"
          >
            <Edit2 className="w-4 h-4 mr-2" />
            Edit
          </Button>
        </div>
      </div>
    </Modal>
  );
}
