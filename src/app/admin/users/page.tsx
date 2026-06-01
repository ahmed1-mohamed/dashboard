"use client";

import { useState, useCallback, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Plus,
  Search,
  Download,
  Settings2,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { AddUserModal } from "@/components/modals/add-user-modal";
import { ViewUserModal } from "@/components/modals/view-user-modal";
import { EditUserModal } from "@/components/modals/edit-user-modal";
import { CreateNewUserInput } from "@/validators/create-new-user.schema";
import useDashboardAdminUsersData from "@/hooks/use-dashboardAdminUsersData";
import { GetUserDataType } from "@/types";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface User {
  user_id: number;
  name: string;
  profile_picture: string;
  role_name: string;
  email: string;
  lastLogin: string;
  status: "Active" | "Inactive" | "Suspended";
}

const roleColors = {
  Admin: "bg-cyan-500 text-white",
  Viewer: "bg-gray-100 text-gray-700",
  Editor: "bg-purple-500 text-white",
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

export default function UsersPage() {
  const { data: session } = useSession();

  const [perPage, setPerPage] = useState(15);
  const [page, setPage] = useState(1);
  const [perPageTrigger, setPerPageTrigger] = useState(0);

  const [countryFilter, setCountryFilter] = useState("all");

  const [statusFilter, setStatusFilter] = useState("all");
  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);

  const [viewUserModalOpen, setViewUserModalOpen] = useState(false);
  const [userIdToView, setUserIdToView] = useState<number | null>(null);

  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<number | null>(null);

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 500);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, statusFilter]);

  const { usersData, deleteUserMutation, addUserMutation } =
    useDashboardAdminUsersData(page, perPage, debouncedSearch, statusFilter);

  const { data, isLoading, isError, error, refetch } = usersData;
  const isDeleting = deleteUserMutation.isPending;

  const handlePerPageChange = (value: string) => {
    setPerPage(Number(value));
    setPage(1);
    setPerPageTrigger((prev) => prev + 1);
  };

  const rawData = data?.data as unknown;
  let usersArray: GetUserDataType[] = [];
  if (Array.isArray(rawData)) {
    usersArray = rawData as GetUserDataType[];
  } else if (
    rawData &&
    typeof rawData === "object" &&
    "data" in rawData &&
    Array.isArray((rawData as { data?: unknown }).data)
  ) {
    usersArray = (rawData as { data?: unknown }).data as GetUserDataType[];
  }

  const users: User[] = usersArray.map(
    (user: GetUserDataType, index: number) => {
      const firstName = user.first_name || "";
      const lastName = user.last_name || "";
      const fullName = `${firstName} ${lastName}`.trim() || "N/A";

      return {
        user_id: user.user_id,
        name: fullName,
        profile_picture: user.profile_picture || "U",
        role_name: user.role_name || "Viewer",
        email: user.email || "N/A",
        lastLogin: "Recently",
        status:
          user.status === "active"
            ? "Active"
            : user.status === "inactive"
              ? "Inactive"
              : "Suspended",
      };
    },
  );

  const filteredUsers = users.filter((user) => {
    const matchesCountry = countryFilter === "all";

    return matchesCountry;
  });

  console.log("Mapped users:", data);

  const rawTotal = (data as any)?.data?.total;
  const total = typeof rawTotal === "number" ? rawTotal : 0;
  const totalPages = Math.max(1, Math.ceil(total / perPage) || 1);

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 10;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (page > 3) {
        pages.push("...");
      }
      let start = Math.max(2, page - 2);
      let end = Math.min(totalPages - 1, page + 2);
      if (page <= 3) {
        start = 2;
        end = Math.min(maxVisible - 2, totalPages - 1);
      }
      if (page >= totalPages - 2) {
        start = Math.max(2, totalPages - maxVisible + 2);
        end = totalPages - 1;
      }
      for (let i = start; i <= end; i++) {
        pages.push(i);
      }
      if (page < totalPages - 2) {
        pages.push("...");
      }
      pages.push(totalPages);
    }
    return pages;
  };

  const getAvatarColor = (index: number) => {
    return avatarColors[index % avatarColors.length];
  };

  const handleAddUser = (data: CreateNewUserInput) => {
    addUserMutation.mutate(data, {
      onSuccess: () => {
        toast.success("User added successfully!");
        setIsAddUserModalOpen(false);
      },
      onError: (error) => {
        console.error(error);
        toast.error("Failed to add user.");
      },
    });
  };

  const handleViewUser = (user: User) => {
    setUserIdToView(user.user_id);
    setViewUserModalOpen(true);
  };

  const handleEditUser = (userId: number) => {
    setUserToEdit(userId);
    setEditUserModalOpen(true);
  };

  const handleDeleteClick = (userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = () => {
    if (!userToDelete) return;
    deleteUserMutation.mutate(userToDelete, {
      onSuccess: () => {
        toast.success("User deleted successfully!");
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      },
      onError: (error) => {
        console.error("Error deleting user:", error);
        toast.error("Failed to delete user");
      },
    });
  };

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Users</h1>
          <Badge
            variant="outline"
            className="bg-purple-100 text-purple-700 border-purple-200 rounded-full px-2"
          >
            {total}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
            onClick={() => setIsAddUserModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Filters and Actions */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
          {/* Search */}
          <div className="relative w-full min-w-[200px] max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search for users"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white border-gray-200"
            />
          </div>

          {/* Country Filter */}
          <Select value={countryFilter} onValueChange={setCountryFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Country" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Countries</SelectItem>
              <SelectItem value="UAE">UAE</SelectItem>
              <SelectItem value="Egypt">Egypt</SelectItem>
              <SelectItem value="Oman">Oman</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Inactive">Inactive</SelectItem>
              <SelectItem value="Suspended">Suspended</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 border-gray-200">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" className="gap-2 border-gray-200">
            <Settings2 className="h-4 w-4" />
            Table settings
          </Button>
        </div>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
            <p className="mt-4 text-sm text-gray-600">Loading users...</p>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <p className="text-sm text-red-800">
            <strong>Error:</strong>{" "}
            {error instanceof Error ? error.message : String(error)}
          </p>
        </div>
      )}

      {/* Table */}
      {!isLoading && !error && (
        <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="font-semibold text-gray-900 w-[200px] px-3 text-sm">
                  Users
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[110px] px-2 text-sm">
                  User Role
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[180px] px-2 text-sm">
                  Email
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[120px] px-2 text-sm">
                  Last Login
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
                  Status
                </TableHead>
                <TableHead className="font-semibold text-gray-900 w-[120px] px-2 text-sm">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={6}
                    className="h-24 text-center text-gray-500"
                  >
                    No users found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredUsers.map((user, index) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="px-3">
                      <div className="flex items-center gap-3">
                        <div
                          className={`h-9 w-9 rounded-full ${getAvatarColor(
                            index,
                          )} flex items-center justify-center flex-shrink-0 text-white overflow-hidden`}
                        >
                          {user.profile_picture && user.profile_picture !== "U" ? (
                            <img
                              src={user.profile_picture}
                              alt={user.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <span className="text-sm font-semibold">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          )}
                        </div>
                        <button 
                          onClick={() => handleViewUser(user)}
                          className="text-gray-900 text-sm font-medium hover:text-teal-600 active:text-teal-800 transition-colors cursor-pointer text-left focus:outline-none"
                        >
                          {user.name}
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="px-2">
                      <Badge
                        className={`${roleColors[
                          user.role_name as keyof typeof roleColors
                        ] || roleColors.Viewer
                          } text-xs px-2 py-0.5 flex items-center gap-1 w-fit`}
                      >
                        {user.role_name === "Viewer" && (
                          <span className="text-[10px]">👁</span>
                        )}
                        {user.role_name}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-sm truncate">
                      {user.email}
                    </TableCell>
                    <TableCell className="text-gray-900 px-2 text-sm">
                      {user.lastLogin}
                    </TableCell>
                    <TableCell className="px-2">
                      <div className="flex items-center gap-2">
                        <div
                          className={`h-2 w-2 rounded-full ${user.status === "Active"
                            ? "bg-green-500"
                            : user.status === "Inactive"
                              ? "bg-red-500"
                              : "bg-gray-400"
                            }`}
                        />
                        <span className="text-gray-900 text-sm">
                          {user.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-2">
                      <div className="flex items-center gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="h-3.5 w-3.5 mr-1" />
                          View
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                          onClick={() => handleEditUser(user.user_id)}
                        >
                          <Edit className="h-3.5 w-3.5 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                          onClick={() => {
                            console.log(
                              "Table delete button clicked, user.user_id:",
                              user.user_id,
                            );
                            handleDeleteClick(user.user_id);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5 mr-1" />
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Pagination */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Show</span>
          <Select
            value={perPage.toString()}
            onValueChange={handlePerPageChange}
          >
            <SelectTrigger className="w-[70px] h-8">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
          <span className="text-sm text-gray-500">of {total} results</span>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="h-8 w-8 border-gray-200"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {getPageNumbers().map((pageNum, index) =>
            typeof pageNum === "number" ? (
              <Button
                key={index}
                variant={page === pageNum ? "default" : "outline"}
                size="icon"
                onClick={() => setPage(pageNum)}
                className={
                  page === pageNum
                    ? "h-8 w-8 bg-gray-900 hover:bg-gray-800 text-white"
                    : "h-8 w-8 border-gray-200"
                }
              >
                {pageNum}
              </Button>
            ) : (
              <span key={index} className="px-1 text-gray-400">
                {pageNum}
              </span>
            ),
          )}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages || totalPages === 0}
            className="h-8 w-8 border-gray-200"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Add User Modal */}
      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
      />

      {/* View User Modal */}
      <ViewUserModal
        isOpen={viewUserModalOpen}
        onClose={() => {
          setViewUserModalOpen(false);
          setUserIdToView(null);
        }}
        userId={userIdToView || 0}
        onEdit={() => {
          setViewUserModalOpen(false);
          if (userIdToView) {
            setUserToEdit(userIdToView);
            setEditUserModalOpen(true);
          }
          setUserIdToView(null);
        }}
        onDelete={() => {
          setViewUserModalOpen(false);
          if (userIdToView) {
            handleDeleteClick(userIdToView);
          }
        }}
      />

      {/* Edit User Modal */}
      <EditUserModal
        isOpen={editUserModalOpen}
        onClose={() => {
          setEditUserModalOpen(false);
          setUserToEdit(null);
        }}
        userId={userToEdit || 0}
        onSuccess={() => {
          // Reload users after successful edit
          window.location.reload();
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete User</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
