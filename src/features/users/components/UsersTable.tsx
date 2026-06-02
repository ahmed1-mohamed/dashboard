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
import { Eye, Edit, Trash2, MoreVertical } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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

  if (users.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 bg-white rounded-lg border border-gray-200 shadow-sm animate-in fade-in zoom-in duration-500">
        <div className="w-20 h-20 mb-4 bg-gray-50 rounded-full flex items-center justify-center">
          <svg className="w-10 h-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">No users found</h3>
        <p className="text-sm text-gray-500 text-center max-w-sm">We couldn't find any users matching your criteria. Try adjusting your search or filters.</p>
      </div>
    );
  }

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
            {users.map((user, index) => (
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
                    className={`${roleColors[user.role_name as keyof typeof roleColors] ||
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
                      className={`h-2 w-2 rounded-full ${user.status === "Active"
                        ? "bg-green-500"
                        : user.status === "Inactive"
                          ? "bg-red-500"
                          : "bg-gray-400"
                        }`}
                    />
                    <span className="text-gray-900 text-sm">{user.status}</span>
                  </div>
                </TableCell>
                <TableCell className="px-2 text-left" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4 text-gray-600" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[160px] bg-white z-50">
                      <DropdownMenuItem onClick={() => onView(user)} className="cursor-pointer">
                        <Eye className="h-4 w-4 mr-2" /> View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onEdit(user.user_id)} className="cursor-pointer">
                        <Edit className="h-4 w-4 mr-2" /> Edit User
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => onDelete(user.user_id)}
                        className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </div>
  );
}
