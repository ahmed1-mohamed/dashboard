import { Badge } from "@/components/ui/badge";
import {
  MoreHorizontal,
  Eye,
  Edit2,
  Trash2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Role } from "../page";

interface RoleCardProps {
  role: Role;
  onView: (role: Role) => void;
  onEdit: (role: Role) => void;
  onDelete: (role: Role) => void;
}

export function RoleCard({ role, onView, onEdit, onDelete }: RoleCardProps) {
  const getPermissionBadges = (role: Role) => {
    if (role.role_type === "admin" || role.role_name.toLowerCase().includes("admin")) {
      return ["All"];
    }
    if (role.permissions) {
      const actions = new Set<string>();
      Object.values(role.permissions).forEach(section => {
        if (section.view) actions.add("View");
        if (section.create) actions.add("add");
        if (section.edit) actions.add("edit");
        if (section.delete) actions.add("delete");
      });
      if (actions.size > 0) return Array.from(actions);
    }
    return ["View", "add", "edit"]; // Fallback if no permissions object
  };

  return (
    <div className="bg-white rounded-xl border border-[#E5E7EB] p-5 hover:shadow-sm transition-shadow flex flex-col justify-between">
      <div>
        <div className="flex items-start justify-between mb-3">
          <div className="flex flex-col gap-1">
            <h3 
              className="font-medium text-[#15042B] text-lg cursor-pointer hover:underline"
              onClick={() => onView(role)}
            >
              {role.role_name}
            </h3>
            <p className="text-[13px] text-[#4A5565]">
              {role.users_count} users
            </p>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-600 p-1 -mr-2"
                aria-label="More options"
                title="More options"
              >
                <MoreHorizontal className="h-5 w-5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <DropdownMenuItem
                onClick={() => onView(role)}
                className="cursor-pointer"
              >
                <Eye className="mr-2 h-4 w-4" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onEdit(role)}
                className="cursor-pointer"
              >
                <Edit2 className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => onDelete(role)}
                className="cursor-pointer text-red-600 focus:text-red-600"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {getPermissionBadges(role).map((badge, index) => (
            <Badge
              key={index}
              variant="secondary"
              className="bg-[#F3F4F6] text-[#111827] border-transparent text-xs px-2.5 py-0.5 font-medium hover:bg-[#E5E7EB]"
            >
              {badge}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  );
}
