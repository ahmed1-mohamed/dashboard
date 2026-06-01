'use client';

import { useToken } from "@/contexts/SessionProviderWrapper";
import { useReview } from "@/hooks/dashboardExpert/useReview";
import ReviewCard, { SkeletonReview } from "./ReviewCard";

interface ReviewsProps {
    limit?: number;
    cardClassName?: string;
}

export default function Reviews({ limit, cardClassName }: ReviewsProps) {
    const { expertId } = useToken();
    const { data, isLoading, isError } = useReview(expertId!);

    const reviews = (data?.data?.data ?? []).slice(0, limit);

    return (
        <div className="flex flex-col gap-4">
            {isLoading && (
                <>
                    <SkeletonReview />
                    <SkeletonReview />
                    <SkeletonReview />
                </>
            )}

            {isError && (
                <p className="text-center text-sm text-red-400 py-6">
                    Failed to load reviews.
                </p>
            )}

            {!isLoading && !isError && reviews.length === 0 && (
                <p className="text-center text-sm text-gray-400 py-8">
                    No reviews yet.
                </p>
            )}

            {!isLoading && !isError && reviews.map((review: any) => (
                <ReviewCard
                    key={review.review_id}
                    review={review}
                    className={cardClassName}
                />
            ))}
        </div>
    );
}