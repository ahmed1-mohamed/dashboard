"use client";

import React, { useState, useCallback, useMemo, Suspense } from "react";
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
import dynamic from "next/dynamic";
import { useServerPagination } from "@/hooks/useServerPagination";
import { User } from "@/features/users/types";
import { CreateNewUserInput } from "@/validators/create-new-user.schema";
import { GetUserDataType } from "@/types";
import { unpackUsersResponse, mapUser } from "@/features/users/utils/map-user";

const UsersTable = dynamic(() => import("@/features/users/components/UsersTable").then(mod => mod.UsersTable), { ssr: false });
const UsersFilters = dynamic(() => import("@/features/users/components/UsersFilters").then(mod => mod.UsersFilters), { ssr: false });
const AddUserModal = dynamic(() => import("@/components/modals/add-user-modal").then(mod => mod.AddUserModal), { ssr: false });
const ViewUserModal = dynamic(() => import("@/components/modals/view-user-modal").then(mod => mod.ViewUserModal), { ssr: false });
const EditUserModal = dynamic(() => import("@/components/modals/edit-user-modal").then(mod => mod.EditUserModal), { ssr: false });
import { TableSettings } from "@/components/table/table-settings";
import { useTableSettings } from "@/hooks/use-table-settings";

export default function UsersPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center">Loading...</div>}>
      <UsersPageContent />
    </Suspense>
  );
}

const INITIAL_FILTERS = { status: "all", role_id: "all" };

function UsersPageContent() {
  const queryClient = useQueryClient();

  const DEFAULT_COLUMNS = [
    { id: "users", label: "Users", visible: true },
    { id: "role", label: "User Role", visible: true },
    { id: "email", label: "Email", visible: true },
    { id: "lastLogin", label: "Last Login", visible: true },
    { id: "status", label: "Status", visible: true },
    { id: "actions", label: "Actions", visible: true },
  ];

  const tableSettings = useTableSettings("users", DEFAULT_COLUMNS);

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
    initialPerPage: tableSettings.settings.itemsPerPage,
    initialFilters: INITIAL_FILTERS,
  });

  React.useEffect(() => {
    setPerPage(String(tableSettings.settings.itemsPerPage));
  }, [tableSettings.settings.itemsPerPage, setPerPage]);

  const {
    usersData,
    users,
    totalUsers,
    deleteUserMutation,
    addUserMutation,
  } = useUsers(
    page,
    perPage,
    debouncedSearch || undefined,
    filters.status !== "all" ? filters.status : undefined,
    filters.role_id !== "all" ? filters.role_id : undefined,
  );

  const { isLoading, isError, error, refetch } = usersData;
  const isDeleting = deleteUserMutation.isPending;

  const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
  const [viewUserModalOpen, setViewUserModalOpen] = useState(false);
  const [userIdToView, setUserIdToView] = useState<number | null>(null);
  const [editUserModalOpen, setEditUserModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<number | null>(null);

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

  const handleExport = useCallback(async () => {
    toast.info("Preparing export... This might take a moment.", { duration: 3000 });
    try {
      let allExportedUsers: User[] = [];
      let currentPage = 1;
      let totalPagesToFetch = 1;
      const batchSize = 100;
      const { AdminUsersService } = await import("@/features/users/services/AdminUsersService");

      do {
        const response: any = await AdminUsersService.getUsers(
          currentPage,
          batchSize,
          debouncedSearch || undefined,
          filters.status !== "all" ? filters.status : undefined,
          filters.role_id !== "all" ? filters.role_id : undefined
        );

        let batch: GetUserDataType[] = [];
        let currentTotal = 0;
        
        const rawData = response?.data || response;
        if (Array.isArray(rawData)) {
          batch = rawData;
          totalPagesToFetch = 1;
        } else {
          const nested = rawData as { data?: unknown; total?: number; meta?: any } | undefined;
          if (Array.isArray(nested?.data)) {
            batch = nested.data as GetUserDataType[];
            currentTotal = nested.total ?? nested.meta?.total ?? batch.length;
          } else {
            const doublyNested = (nested?.data as { data?: unknown; total?: number } | undefined);
            if (Array.isArray(doublyNested?.data)) {
              batch = doublyNested.data as GetUserDataType[];
              currentTotal = doublyNested.total ?? batch.length;
            }
          }
          if (currentTotal > 0) {
            totalPagesToFetch = Math.ceil(currentTotal / batchSize);
          } else {
            totalPagesToFetch = 1;
          }
        }

        const mappedBatch: User[] = batch.map(mapUser);

        allExportedUsers = [...allExportedUsers, ...mappedBatch];
        currentPage++;
      } while (currentPage <= totalPagesToFetch);

      if (allExportedUsers.length === 0) {
        toast.info("No users to export");
        return;
      }

      const headers = ["ID", "Name", "Email", "Role", "Status"];
      const rows = allExportedUsers.map((u) => [
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
      toast.success("Users exported successfully!");
    } catch (error) {
      toast.error("Failed to export users");
    }
  }, [debouncedSearch, filters.status, filters.role_id]);

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
              roleFilter={filters.role_id}
              onRoleChange={(val) => setFilter("role_id", val)}
            />
            <div className="flex items-center gap-2">
              <TableSettings 
                settings={tableSettings} 
                onExportCsv={handleExport} 
              />
            </div>
          </div>

          <UsersTable
            settings={tableSettings}
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

      {isAddUserModalOpen && (
        <AddUserModal
          isOpen={isAddUserModalOpen}
          onClose={() => setIsAddUserModalOpen(false)}
          onSubmit={handleAddUser}
        />
      )}

      {viewUserModalOpen && (
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
      )}

      {editUserModalOpen && (
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
      )}

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
