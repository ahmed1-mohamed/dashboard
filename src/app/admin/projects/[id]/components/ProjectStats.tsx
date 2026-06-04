import { ProjectData } from "../types";
import { Building, CheckCircle, Activity, Bookmark, ShoppingCart, Info } from "lucide-react";

interface ProjectStatsProps {
  data: ProjectData;
}

export function ProjectStats({ data }: ProjectStatsProps) {
  const stats = [
    {
      label: "Total Units",
      value: data?.total_units || 0,
      icon: Building,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      label: "Available Units",
      value: data?.available_properties_count || data?.available_units || 0,
      icon: CheckCircle,
      color: "text-teal-600",
      bg: "bg-teal-50",
    },
    {
      label: "Active Units",
      value: data?.active_properties_count || 0,
      icon: Activity,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      label: "Booked Units",
      value: data?.booked_properties_count || 0,
      icon: Bookmark,
      color: "text-amber-600",
      bg: "bg-amber-50",
    },
    {
      label: "Sold Units",
      value: data?.sold_properties_count || 0,
      icon: ShoppingCart,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "Status",
      value: data?.status || "N/A",
      icon: Info,
      color: "text-slate-600",
      bg: "bg-slate-100",
      capitalize: true,
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 my-6">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-white rounded-2xl border border-slate-200 p-5 flex flex-col items-center justify-center text-center shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group"
        >
          <div className={`${stat.bg} ${stat.color} p-3 rounded-full mb-3 group-hover:scale-110 transition-transform duration-300`}>
            <stat.icon className="h-5 w-5" />
          </div>
          <p className={`text-2xl font-bold text-slate-900 ${stat.capitalize ? "capitalize" : ""}`}>
            {stat.value}
          </p>
          <p className="text-xs sm:text-sm font-medium text-slate-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
