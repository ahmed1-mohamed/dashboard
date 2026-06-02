"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { PageHeader } from "@/components/shared/PageHeader";
import { Pagination } from "@/components/shared/Pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Download, Settings2, AlertCircle, AlertTriangle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";

import { useUsers } from "@/features/users/hooks/useUsers";
import { UsersTable } from "@/features/users/components/UsersTable";
import { UsersFilters } from "@/features/users/components/UsersFilters";
import { useServerPagination } from "@/hooks/useServerPagination";
import { User } from "@/features/users/types";
import { GetUserDataType } from "@/types";

import { AddUserModal } from "@/components/modals/add-user-modal";
import { ViewUserModal } from "@/components/modals/view-user-modal";
import { EditUserModal } from "@/components/modals/edit-user-modal";
import { CreateNewUserInput } from "@/validators/create-new-user.schema";

export default function UsersPage() {
  const queryClient = useQueryClient();

  const {
    page,
    perPage,
    searchQuery,
    debouncedSearch,
    filters,
    setPage,
    setPerPage,
    setSearchQuery,
    setFilter,
  } = useServerPagination({
    initialPage: 1,
    initialPerPage: 15,
    initialFilters: { status: "all", role: "all" },
  });

  const { usersData, deleteUserMutation, addUserMutation } = useUsers(
    page,
    perPage,
    debouncedSearch || undefined,
    filters.status !== "all" ? filters.status : undefined,
    filters.role !== "all" ? filters.role : undefined,
  );

  const { data, isLoading, isError, error, refetch } = usersData;
  const isDeleting = deleteUserMutation.isPending;

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [viewUserModalOpen, setViewUserModalOpen] = useState(false);
  const [userIdToView, setUserIdToView] = useState<number | null>(null);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

  // Extract paginated data from API response
  const usersRaw: GetUserDataType[] = useMemo(() => {
    const rawData = (data as { data?: unknown })?.data;
    let arr: GetUserDataType[] = [];
    if (Array.isArray(rawData)) {
      arr = rawData as GetUserDataType[];
    } else {
      const nested = (rawData as { data?: unknown } | undefined)?.data;
      if (Array.isArray(nested)) arr = nested as GetUserDataType[];
    }
    return arr;
  }, [data]);

  const totalUsers: number = useMemo(() => {
    const rawData = (data as { data?: unknown })?.data;
    if (rawData && typeof rawData === "object" && "total" in rawData) {
      return (rawData as { total: number }).total;
    }
    return usersRaw.length;
  }, [data, usersRaw.length]);

  const users: User[] = useMemo(() => {
    return usersRaw.map((user) => {
      const firstName = user.first_name ?? "";
      const lastName = user.last_name ?? "";
      const fullName = `${firstName} ${lastName}`.trim() || "N/A";
      return {
        user_id: user.user_id,
        name: fullName,
        profile_picture: user.profile_picture || "U",
        role_name: user.role?.role_name || user.role_name || "User",
        email: user.email || "N/A",
        lastLogin: "Recently",
        status:
          user.status === "active"
            ? "Active"
            : user.status === "inactive"
              ? "Inactive"
              : "Suspended",
      };
    });
  }, [usersRaw]);

  const totalPages = Math.max(1, Math.ceil(totalUsers / perPage));

  const handleAddUser = useCallback(
    (userData: CreateNewUserInput) => {
      addUserMutation.mutate(userData, {
        onSuccess: () => {
          toast.success("User added successfully!");
          setIsAddUserModalOpen(false);
        },
        onError: () => toast.error("Failed to add user."),
      });
    },
    [addUserMutation],
  );

  const handleViewUser = useCallback((user: User) => {
    setUserIdToView(user.user_id);
    setViewUserModalOpen(true);
  }, []);

  const handleExport = useCallback(() => {
    if (users.length === 0) {
      toast.info("No users to export");
      return;
    }
    const headers = ["ID","Name","Email","Role","Status"];
    const rows = users.map((u) => [
      u.user_id, `"${u.name}"`, `"${u.email}"`, `"${u.role_name}"`, u.status,
    ]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `users_${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Users exported!");
  }, [users]);

  const handleEditUser = useCallback((userId: number) => {
    setUserToEdit(userId);
    setEditUserModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((userId: number) => {
    setUserToDelete(userId);
    setDeleteDialogOpen(true);
  }, []);

  const handleConfirmDelete = useCallback(() => {
    if (!userToDelete) return;
    deleteUserMutation.mutate(userToDelete, {
      onSuccess: () => {
        toast.success("User deleted successfully!");
        setDeleteDialogOpen(false);
        setUserToDelete(null);
      },
      onError: () => toast.error("Failed to delete user"),
    });
  }, [userToDelete, deleteUserMutation]);

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      <PageHeader
        title="Users"
        totalItems={totalUsers}
        actionButtonText="Add User"
        onActionClick={() => setIsAddUserModalOpen(true)}
      />

      {isLoading ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-10 w-[200px]" />
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <Skeleton className="h-8 w-8 rounded-full" />
                <Skeleton className="h-4 w-[150px]" />
                <Skeleton className="h-4 w-[120px]" />
                <Skeleton className="h-4 w-[80px]" />
              </div>
            ))}
          </div>
        </div>
      ) : isError ? (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-800">
              <strong>Error:</strong>{" "}
              {error instanceof Error ? error.message : "Failed to load users"}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
            className="mt-2 border-red-200 text-red-700 hover:bg-red-100"
          >
            Try Again
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <UsersFilters
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              statusFilter={filters.status}
              onStatusChange={(val) => setFilter("status", val)}
              roleFilter={filters.role}
              onRoleChange={(val) => setFilter("role", val)}
            />
            <div className="flex items-center gap-2">
              <Button variant="outline" className="gap-2 border-gray-200" onClick={handleExport}>
                <Download className="h-4 w-4" /> Export
              </Button>
              <Button variant="outline" className="gap-2 border-gray-200">
                <Settings2 className="h-4 w-4" /> Table settings
              </Button>
            </div>
          </div>

          <UsersTable
            users={users}
            onView={handleViewUser}
            onEdit={handleEditUser}
            onDelete={handleDeleteClick}
          />

          <Pagination
            page={page}
            totalPages={totalPages}
            perPage={perPage}
            totalItems={totalUsers}
            currentItemsCount={users.length}
            onPageChange={setPage}
            onPerPageChange={setPerPage}
          />
        </>
      )}

      <AddUserModal
        isOpen={isAddUserModalOpen}
        onClose={() => setIsAddUserModalOpen(false)}
        onSubmit={handleAddUser}
      />

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
          if (userIdToView) handleDeleteClick(userIdToView);
        }}
      />

      <EditUserModal
        isOpen={editUserModalOpen}
        onClose={() => {
          setEditUserModalOpen(false);
          setUserToEdit(null);
        }}
        userId={userToEdit || 0}
        onSuccess={() => {
          queryClient.invalidateQueries({ queryKey: ["users"] });
        }}
      />

      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-red-600">
              <AlertTriangle className="h-5 w-5" /> Delete User
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
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
