import { TrendingUp, TrendingDown } from "lucide-react";
import { type StatsCard } from "../types";

export function StatsCards({ stats }: { stats: StatsCard[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((card, index) => (
        <div
          key={index}
          className="bg-white rounded-lg border border-gray-200 p-4"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-gray-600">
              <card.icon className="h-4 w-4" />
              <span className="text-sm font-medium">{card.title}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-3xl font-bold text-gray-900">
              {card.value}
            </div>
            <div
              className={`flex items-center gap-1 text-xs ${
                card.isPositive ? "text-green-600" : "text-red-600"
              }`}
            >
              {card.isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{card.change}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
