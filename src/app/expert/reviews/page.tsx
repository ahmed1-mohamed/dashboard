import Reviews from "@/components/dashboardExperts/Reviews/Review";

export default function page() {
    return (
        <div className="space-y-6">

            <h2 className="text-2xl font-semibold text-[#15042B]">
                Reviews
            </h2>

            <Reviews cardClassName="bg-white border border-[#E5E7EB] rounded-2xl shadow-sm" />

        </div>

    )
}
