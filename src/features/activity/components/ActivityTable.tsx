import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { TableActions } from "@/components/table/table-actions";
import { Activity } from "../types";

interface ActivityTableProps {
  activities: Activity[];
  selectedActivities: number[];
  onSelectAll: (checked: boolean) => void;
  onSelectActivity: (id: number, checked: boolean) => void;
  onView?: (id: number) => void;
  onCreate?: (id: number) => void;
  onUpdate?: (id: number) => void;
  onDelete?: (id: number) => void;
  onLogin?: (id: number) => void;
}

export function ActivityTable({
  activities,
  selectedActivities,
  onSelectAll,
  onSelectActivity,
  onView,
  onCreate,
  onUpdate,
  onDelete,
  onLogin,
}: ActivityTableProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white overflow-hidden overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50 hover:bg-gray-50">
            <TableHead className="w-[35px] px-4">
              <Checkbox
                checked={
                  activities.length > 0 &&
                  selectedActivities.length === activities.length
                }
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[120px] px-2 text-sm">
              User
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
              Action
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[100px] px-2 text-sm">
              Entity
            </TableHead>
            <TableHead className="font-semibold text-gray-900 min-w-[200px] px-2 text-sm">
              Description
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[150px] px-2 text-sm">
              Date & Time
            </TableHead>
            <TableHead className="font-semibold text-gray-900 w-[120px] px-2 text-sm">
              IP Address
            </TableHead>
            <TableHead className="font-semibold text-gray-900 text-center w-[80px] px-2 text-sm">
              Actions
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="h-24 text-center text-gray-500"
              >
                No activities found.
              </TableCell>
            </TableRow>
          ) : (
            activities.map((activity, index) => (
              <TableRow key={activity.id || `activity-${index}`}>
                <TableCell className="px-4">
                  <Checkbox
                    checked={selectedActivities.includes(activity.id)}
                    onCheckedChange={(checked) =>
                      onSelectActivity(activity.id, checked as boolean)
                    }
                  />
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm font-medium truncate">
                  <span
                    onClick={() => onView && onView(activity.id)}
                    className="text-teal-600 hover:text-teal-700  text-sm truncate max-w-[120px] inline-block cursor-pointer"
                  >
                    {activity.user}
                  </span>
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm">
                  {activity.action}
                </TableCell>
                <TableCell className="text-gray-900 px-2 text-sm">
                  {activity.entity}
                </TableCell>
                <TableCell 
                  className="text-gray-500 px-2 text-sm truncate max-w-[150px] sm:max-w-[200px] cursor-help" 
                  title={activity.description}
                >
                  {activity.description}
                </TableCell>
                <TableCell className="text-gray-500 px-2 text-sm">
                  {activity.dateTime}
                </TableCell>
                <TableCell className="text-gray-500 px-2 text-sm">
                  {activity.ipAddress}
                </TableCell>
                <TableCell className="text-center px-2">
                  <TableActions
                    onView={onView ? () => onView(activity.id) : undefined}
                    onDelete={onDelete ? () => onDelete(activity.id) : undefined}
                  />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}