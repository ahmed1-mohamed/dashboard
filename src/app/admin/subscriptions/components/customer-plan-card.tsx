import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Eye, Edit, Trash2, Check } from "lucide-react";

export function CustomerPlanCard({
  plan,
  onView,
  onEdit,
  onDelete,
}: {
  plan: any;
  onView: (id: number | string) => void;
  onEdit: (id: number | string) => void;
  onDelete: (id: number | string) => void;
}) {
  const featuresList: string[] = [];
  if (Array.isArray(plan?.features)) {
    plan.features.forEach((feature: any) => {
      if (feature.enabled) {
        let label = feature.name || feature.code;
        if (feature.limit) {
          label += ` (Limit: ${feature.limit})`;
        }
        featuresList.push(label);
      }
    });
  } else if (plan?.features) {
    Object.entries(plan.features).forEach(([key, value]) => {
      let formattedKey = key
        .split('_')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      if (key === 'map_filters') formattedKey = 'Map & Filters';
      if (key === 'chat_support') formattedKey = 'Chat & Support';

      let label = formattedKey;
      if (typeof value === 'boolean') {
        if (!value) return;
      } else if (value !== null && value !== '') {
        label = `${formattedKey} (${value})`;
      }
      featuresList.push(label);
    });
  }

  const description = plan.description || "For registered users only";

  return (
    <Card className="relative border border-gray-100 hover:border-teal-500 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 bg-white/80 backdrop-blur-sm group cursor-pointer overflow-hidden rounded-2xl">
      <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-teal-400 to-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <CardContent className="p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-teal-700 transition-colors">{plan.name}</h3>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-gray-900 hover:bg-gray-100/50 rounded-full transition-colors">
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl shadow-lg border-gray-100">
              <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg m-1" onClick={() => onView(plan.plan_id)}>
                <Eye className="w-4 h-4 text-gray-500" />
                View
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer rounded-lg m-1" onClick={() => onEdit(plan.plan_id)}>
                <Edit className="w-4 h-4 text-blue-500" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2 cursor-pointer text-red-600 focus:text-red-700 focus:bg-red-50 rounded-lg m-1" onClick={() => onDelete(plan.plan_id)}>
                <Trash2 className="w-4 h-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex items-baseline gap-1 mt-2">
          <span className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            ${plan.price}
          </span>
          <span className="text-sm font-medium text-gray-500 ml-1">
            /{plan.interval === 'month' ? 'month' : plan.interval === 'year' ? 'year' : 'Forever'}
          </span>
        </div>

        <p className="text-sm text-gray-500 pb-2">{description}</p>

        <div className="h-px bg-gray-100 -mx-6" />

        <ul className="space-y-3 pt-2">
          {featuresList.map((feature, idx) => (
            <li key={idx} className="flex items-center gap-3 text-sm text-gray-600">
              <div className="flex-shrink-0 flex items-center justify-center w-5 h-5 rounded-full border border-teal-200 bg-teal-50 text-teal-600 shadow-sm">
                <Check className="w-3.5 h-3.5" />
              </div>
              {feature}
            </li>
          ))}
          {featuresList.length === 0 && (
            <li className="text-sm text-gray-400 italic flex items-center justify-center py-2">
              No features listed
            </li>
          )}
        </ul>
      </CardContent>
    </Card>
  );
}
