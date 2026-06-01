"use client";

import { useQuery } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchUsersDetails } from "@/data/api-client";
import {
  Mail,
  User,
  Phone,
  Calendar,
  Clock,
  Building,
  FileText,
} from "lucide-react";

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
  role: {
    role_id: number;
    role_name: string;
    role_type: string;
  };
}

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  active: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  rejected: "bg-red-100 text-red-800",
};

interface ViewMeetingModalProps {
  meetingId: number | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ViewMeetingModal({
  meetingId,
  isOpen,
  onClose,
}: ViewMeetingModalProps) {
  // const { data: session } = useSession();
  // const token = session?.user?.accessToken;

  // const { data: userData, isLoading } = useQuery<UserDetailResponse>({
  //   queryKey: ["userDetails", meetingId],
  //   queryFn: () => fetchUsersDetails(meetingId!, token!),
  //   enabled: !!meetingId && !!token && isOpen,
  // });

  // const formatDate = (dateString: string | null) => {
  //   if (!dateString) return "N/A";
  //   return new Date(dateString).toLocaleDateString("en-US", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });
  // };

  // if (!isOpen || !meetingId) return null;

  // const getInitials = (firstName: string, lastName: string) => {
  //   const first = firstName?.charAt(0) || "";
  //   const last = lastName?.charAt(0) || "";
  //   return `${first}${last}`.toUpperCase() || "U";
  // };

  // const avatarColors = [
  //   "bg-pink-500",
  //   "bg-blue-500",
  //   "bg-green-500",
  //   "bg-yellow-500",
  //   "bg-purple-500",
  //   "bg-indigo-500",
  //   "bg-red-500",
  //   "bg-cyan-500",
  // ];

  // const getAvatarColor = (name: string) => {
  //   const index = name?.charCodeAt(0) || 0 % avatarColors.length;
  //   return avatarColors[index];
  // };

  // const userName = userData
  //   ? `${userData.first_name} ${userData.last_name}`.trim()
  //   : "User";

  // const userEmail = userData?.email || "N/A";
  // const userPhone = userData?.phone_number || "N/A";
  // const userProfilePicture = userData?.profile_picture || null;

  // if (isLoading) {
  //   return (
  //     <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg">
  //       <div className="flex items-center justify-center py-12">
  //         <div className="text-center">
  //           <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
  //           <p className="mt-4 text-sm text-gray-600">
  //             Loading user details...
  //           </p>
  //         </div>
  //       </div>
  //     </Modal>
  //   );
  // }

  // return (
  //   <Modal isOpen={isOpen} onClose={onClose} title="User Details" size="lg" scrollable>
  //     <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
  //       {/* Header */}
  //       <div className="flex items-center justify-between">
  //         <div className="flex items-center gap-3">
  //           {userProfilePicture ? (
  //             <img
  //               src={userProfilePicture}
  //               alt={userName}
  //               className="w-12 h-12 rounded-full object-cover"
  //             />
  //           ) : (
  //             <div
  //               className={`w-12 h-12 rounded-full ${getAvatarColor(
  //                 userName,
  //               )} flex items-center justify-center text-white font-semibold`}
  //             >
  //               {userData
  //                 ? getInitials(userData.first_name, userData.last_name)
  //                 : "U"}
  //             </div>
  //           )}
  //           <div>
  //             <h3 className="text-lg font-semibold text-gray-900">
  //               {userName}
  //             </h3>
  //             <p className="text-sm text-gray-500">ID: {meetingId}</p>
  //           </div>
  //         </div>
  //         {userData?.status && (
  //           <Badge
  //             className={
  //               statusColors[userData.status] || "bg-gray-100 text-gray-800"
  //             }
  //           >
  //             {userData.status.charAt(0).toUpperCase() + userData.status.slice(1)}
  //           </Badge>
  //         )}
  //       </div>

  //       {/* User Info Grid */}
  //       <div className="grid grid-cols-1 gap-4">
  //         {/* User Email */}
  //         <div className="p-4 bg-gray-50 rounded-lg">
  //           <div className="flex items-center gap-2 text-gray-500 mb-1">
  //             <Mail className="w-4 h-4" />
  //             <span className="text-sm">Email</span>
  //           </div>
  //           <p className="font-medium text-gray-900">
  //             {userEmail}
  //           </p>
  //         </div>

  //         {/* User Phone */}
  //         <div className="p-4 bg-gray-50 rounded-lg">
  //           <div className="flex items-center gap-2 text-gray-500 mb-1">
  //             <Phone className="w-4 h-4" />
  //             <span className="text-sm">Phone Number</span>
  //           </div>
  //           <p className="font-medium text-gray-900">
  //             {userPhone}
  //           </p>
  //         </div>

  //         {/* User Role */}
  //         {userData?.role && (
  //           <div className="p-4 bg-gray-50 rounded-lg">
  //             <div className="flex items-center gap-2 text-gray-500 mb-1">
  //               <User className="w-4 h-4" />
  //               <span className="text-sm">Role</span>
  //             </div>
  //             <Badge className="bg-blue-100 text-blue-800">
  //               {userData.role.role_name}
  //             </Badge>
  //           </div>
  //         )}

  //         {/* Description */}
  //         {userData?.description && (
  //           <div className="p-4 bg-gray-50 rounded-lg">
  //             <div className="flex items-center gap-2 text-gray-500 mb-1">
  //               <FileText className="w-4 h-4" />
  //               <span className="text-sm">Description</span>
  //             </div>
  //             <p className="font-medium text-gray-900">{userData.description}</p>
  //           </div>
  //         )}

  //         {/* Member Since */}
  //         <div className="p-4 bg-gray-50 rounded-lg">
  //           <div className="flex items-center gap-2 text-gray-500 mb-1">
  //             <Calendar className="w-4 h-4" />
  //             <span className="text-sm">Member Since</span>
  //           </div>
  //           <p className="font-medium text-gray-900">
  //             {formatDate(userData?.created_at || null)}
  //           </p>
  //         </div>
  //       </div>

  //       {/* Action Buttons */}
  //       <div className="flex gap-3 justify-end pt-4 border-t">
  //         <Button
  //           variant="outline"
  //           onClick={onClose}
  //         >
  //           Close
  //         </Button>
  //       </div>
  //     </div>
  //   </Modal>
  // );
}