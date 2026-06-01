import React from "react"
import { Star } from "lucide-react"
import { cn } from "@/lib/utils"

const ratingVariants = {
    default: {
        star: "text-gray-500",
        emptyStar: "text-gray-300",
    },
    yellow: {
        star: "text-yellow-500",
        emptyStar: "text-yellow-400",
    },
    deepyellow: {
        star: "text-yellow-600",
        emptyStar: "text-yellow-400",
    },
}

// Modified interface to avoid the onChange conflict
interface RatingsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
    rating: number
    totalStars?: number
    size?: number
    fill?: boolean
    Icon?: React.ComponentType<{ size?: number; className?: string }>
    variant?: keyof typeof ratingVariants
    interactive?: boolean
    onChange?: (rating: number) => void
}

const Ratings = ({
    rating,
    totalStars = 1,
    size = 20,
    fill = true,
    Icon = Star,
    variant = "default",
    interactive = false,
    onChange,
    ...rest
}: RatingsProps) => {
    const fullStars = Math.floor(rating)
    const partialStar =
        rating % 1 > 0 ? (
            <PartialStar
                fillPercentage={rating % 1}
                size={size}
                className={cn(ratingVariants[variant].star)}
                Icon={Icon}
            />
        ) : null

    const handleStarClick = (selectedRating: number) => {
        if (interactive && onChange) {
            // If clicking on the current full rating, reduce by 1
            if (selectedRating === rating) {
                onChange(Math.max(selectedRating, 1))
            } else {
                onChange(selectedRating)
            }
        }
    }

    const handleStarHover = (event: React.MouseEvent, position: number) => {
        if (!interactive || !onChange) return

        // Calculate rating based on mouse position within the star
        const star = event.currentTarget as HTMLElement
        const rect = star.getBoundingClientRect()
        const width = rect.width
        const relativeX = event.clientX - rect.left

        // If mouse is on the left half of the star, make it a half star
        const halfStarThreshold = width / 2
        const rating = relativeX <= halfStarThreshold
            ? position
            : position

        // Don't allow rating to be less than 0.5
        onChange(Math.max(rating, 0.5))
    }

    return (
        <div className={cn("flex items-center gap-2")} {...rest}>
            {[...Array(totalStars)].map((_, i) => {
                const starPosition = i + 1
                const isFilled = starPosition <= fullStars
                const isPartiallyFilled = !isFilled && starPosition === fullStars + 1 && rating % 1 > 0

                return (
                    <div
                        key={i}
                        className={cn(
                            "relative",
                            interactive && "cursor-pointer"
                        )}
                        onClick={interactive ? () => handleStarClick(starPosition) : undefined}
                        onMouseMove={interactive ? (e) => handleStarHover(e, starPosition) : undefined}
                    >
                        <Icon
                            size={size}
                            className={cn(
                                isFilled && fill ? "fill-current" : "fill-transparent",
                                isFilled ? ratingVariants[variant].star : ratingVariants[variant].emptyStar,
                                interactive && "transition-colors duration-100"
                            )}
                        />
                        {isPartiallyFilled && (
                            <div
                                style={{
                                    position: "absolute",
                                    top: 0,
                                    left: 0,
                                    overflow: "hidden",
                                    width: `${(rating % 1) * 100}%`,
                                }}
                            >
                                <Icon
                                    size={size}
                                    className={cn("fill-current", ratingVariants[variant].star)}
                                />
                            </div>
                        )}
                    </div>
                )
            })}
        </div>
    )
}

interface PartialStarProps {
    fillPercentage: number
    size: number
    className?: string
    Icon: React.ComponentType<{ size?: number; className?: string }>
}

const PartialStar = ({ fillPercentage, size, className, Icon }: PartialStarProps) => {
    return (
        <div style={{ position: "relative", display: "inline-block" }}>
            <Icon size={size} className={cn("fill-transparent", className)} />
            <div
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    overflow: "hidden",
                    width: `${fillPercentage * 100}%`,
                }}
            >
                <Icon size={size} className={cn("fill-current", className)} />
            </div>
        </div>
    )
}

export { Ratings }
