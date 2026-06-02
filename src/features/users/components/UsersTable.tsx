import React from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, Edit, Trash2 } from "lucide-react";
import { User } from "../types";

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

interface UsersTableProps {
  users: User[];
  onView: (user: User) => void;
  onEdit: (userId: number) => void;
  onDelete: (userId: number) => void;
}

export function UsersTable({ users, onView, onEdit, onDelete }: UsersTableProps) {
  const getAvatarColor = (index: number) => avatarColors[index % avatarColors.length];

  return (
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
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="h-24 text-center text-gray-500">
                No users found.
              </TableCell>
            </TableRow>
          ) : (
            users.map((user, index) => (
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
                      onClick={() => onView(user)}
                      className="text-gray-900 text-sm font-medium hover:text-teal-600 active:text-teal-800 transition-colors cursor-pointer text-left focus:outline-none"
                    >
                      {user.name}
                    </button>
                  </div>
                </TableCell>
                <TableCell className="px-2">
                  <Badge
                    className={`${
                      roleColors[user.role_name as keyof typeof roleColors] ||
                      roleColors.Viewer
                    } text-xs px-2 py-0.5 flex items-center gap-1 w-fit`}
                  >
                    {user.role_name === "Viewer" && <span className="text-[10px]">👁</span>}
                    {user.role_name}
                  </Badge>
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm truncate max-w-[180px]">
                  {user.email}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm">
                  {user.lastLogin}
                </TableCell>
                <TableCell className="px-2">
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-2 w-2 rounded-full ${
                        user.status === "Active"
                          ? "bg-green-500"
                          : user.status === "Inactive"
                          ? "bg-red-500"
                          : "bg-gray-400"
                      }`}
                    />
                    <span className="text-gray-900 text-sm">{user.status}</span>
                  </div>
                </TableCell>
                <TableCell className="px-2">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      onClick={() => onView(user)}
                    >
                      <Eye className="h-3.5 w-3.5 mr-1" /> View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                      onClick={() => onEdit(user.user_id)}
                    >
                      <Edit className="h-3.5 w-3.5 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      onClick={() => onDelete(user.user_id)}
                    >
                      <Trash2 className="h-3.5 w-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
