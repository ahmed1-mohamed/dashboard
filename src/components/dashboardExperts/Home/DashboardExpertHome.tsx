'use client';

import Reviews from "../Reviews/Review";
import Metrics from "./Metrics";
import Bookings from "./Bookings";
import { CalendarRange, ChevronRight, Star } from "lucide-react";
import Link from "next/link";

export default function DashboardExpertHome() {

    return (
        <>
            <div className="flex flex-col">
                <h1 className="text-2xl font-bold">Welcome back, Expert!</h1>
                <Metrics />
                <div className="flex flex-wrap gap-6">
                    <div className="relative flex-1 bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_1px_0.5px_0.05px_rgba(29, 41, 61, 0.02)] p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <CalendarRange className="w-6 h-6 text-[#4A5565]" />
                                <h2 className="text-[18px] font-medium text-[#15042B]">Upcoming Appointments</h2>
                            </div>
                            <Link
                                href="/expert/bookings"
                                className="flex items-center gap-1 text-[14px] font-medium text-[#007A55] hover:text-[#007a55e0] transition-colors"
                            >
                                View Bookings
                                <ChevronRight className="text-[#001111] w-4 h-4" />
                            </Link>
                        </div>
                        <Bookings />
                    </div>
                    <div className="relative flex-1 bg-white border border-[#E5E7EB] rounded-2xl shadow-[0_1px_0.5px_0.05px_rgba(29, 41, 61, 0.02)] p-6 flex flex-col gap-4">
                        <div className="flex items-center justify-between mb-1">
                            <div className="flex items-center gap-2">
                                <Star className="w-6 h-6 text-[#4A5565]" />
                                <h2 className="text-[18px] font-medium text-[#15042B]">Recent Reviews</h2>
                            </div>
                            <Link
                                href="/expert/reviews"
                                className="flex items-center gap-1 text-[14px] font-medium text-[#007A55] hover:text-[#007a55e0] transition-colors"
                            >
                                View Reviews
                                <ChevronRight className="text-[#001111] w-4 h-4" />
                            </Link>
                        </div>
                        <Reviews limit={3} cardClassName="bg-[#F9FAFB] border border-[#F3F4F6] rounded-2xl" />
                    </div>
                </div>
            </div>
        </>
    );
}
