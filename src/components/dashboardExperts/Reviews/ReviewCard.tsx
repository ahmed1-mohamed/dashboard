'use client';

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Ratings } from "@/components/ui/rating";
import { getInitials } from "@/utlis/format";


export default function ReviewCard({
    review,
    className = "",
}: {
    review: {
        review_id: number;
        rating: number;
        comment: string;
        customer?: {
            first_name?: string;
            last_name?: string;
            profile_picture?: string;
        } | null;
        created_at: string;
    };
    className?: string;
}) {
    const firstName = review.customer?.first_name || "Anonymous";
    const lastName = review.customer?.last_name || "";
    const fullName = `${firstName} ${lastName}`.trim();

    return (
        <div className={`p-6 bg-[#F9FAFB] border border-[#F3F4F6] rounded-2xl shadow-none flex gap-4 ${className}`}>
            <Avatar className="h-16 w-16 border-2 rounded-lg border-primary/10 flex-shrink-0">
                {review.customer?.profile_picture ? (
                    <img
                        src={review.customer.profile_picture}
                        alt={fullName}
                        className="h-full w-full object-cover rounded-lg"
                        onError={(e) => {
                            e.currentTarget.style.display = "none";
                        }}
                    />
                ) : (
                    <AvatarFallback className="bg-primary/5 text-primary text-lg rounded-lg">
                        {getInitials(fullName)}
                    </AvatarFallback>
                )}
            </Avatar>

            <div className="flex flex-col gap-1.5 min-w-0">
                <span className="font-semibold text-[#15042B] text-[16px]">{fullName}</span>
                <Ratings rating={review.rating} totalStars={5} variant="yellow" size={16} />
                <p className="text-[#4A5565] text-[14px] leading-relaxed line-clamp-2">
                    {review.comment}
                </p>
            </div>
        </div>
    );
}

export function SkeletonReview() {
    return (
        <div className="flex gap-3 py-4 border-b border-gray-100 last:border-0 animate-pulse">
            <div className="w-11 h-11 rounded-full bg-gray-100 flex-shrink-0" />
            <div className="flex flex-col gap-2 flex-1">
                <div className="h-4 w-28 bg-gray-100 rounded" />
                <div className="h-3 w-24 bg-gray-100 rounded" />
                <div className="h-3 w-full bg-gray-100 rounded" />
            </div>
        </div>
    );
}

