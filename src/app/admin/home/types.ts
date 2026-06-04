import { type LucideIcon } from "lucide-react";

export interface StatsCard {
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: LucideIcon;
}

export interface Booking {
  id: number;
  name: string;
  avatar: string;
  property: string;
  unit: string;
  lastUpdated: string;
  amount: string;
  status: string;
}
