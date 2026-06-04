import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function ChartsSection() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Sales Stages Status Overview */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Sales Stages Status Overview
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            Track progress across all sales stages
          </p>
        </div>

        {/* Stacked Bar Chart */}
        <div className="space-y-4">
          <div className="flex items-end justify-around h-64 gap-3">
            {/* Sales Purchase */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden h-40">
                <div className="w-full bg-green-500 h-[40%]"></div>
                <div className="w-full bg-cyan-400 h-[35%]"></div>
                <div className="w-full bg-pink-500 h-[25%]"></div>
              </div>
              <span className="text-xs text-gray-600 mt-2 text-center">
                Sales Purchase
              </span>
            </div>

            {/* Down Payment */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden h-48">
                <div className="w-full bg-green-500 h-[50%]"></div>
                <div className="w-full bg-cyan-400 h-[30%]"></div>
                <div className="w-full bg-pink-500 h-[20%]"></div>
              </div>
              <span className="text-xs text-gray-600 mt-2 text-center">
                Down Payment
              </span>
            </div>

            {/* Sales Offer */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden h-32">
                <div className="w-full bg-green-500 h-[35%]"></div>
                <div className="w-full bg-cyan-400 h-[40%]"></div>
                <div className="w-full bg-pink-500 h-[25%]"></div>
              </div>
              <span className="text-xs text-gray-600 mt-2 text-center">
                Sales Offer
              </span>
            </div>

            {/* Identification */}
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-gray-100 rounded-t-lg overflow-hidden h-56">
                <div className="w-full bg-green-500 h-[45%]"></div>
                <div className="w-full bg-cyan-400 h-[35%]"></div>
                <div className="w-full bg-pink-500 h-[20%]"></div>
              </div>
              <span className="text-xs text-gray-600 mt-2 text-center">
                Identification
              </span>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center justify-center gap-6 pt-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Completed</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
              <span className="text-xs text-gray-600">In Progress</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-pink-500"></div>
              <span className="text-xs text-gray-600">Rejected</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sales Stages */}
      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">
              Sales Stages
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Overview of all reservation statuses and types
            </p>
          </div>
          <Select defaultValue="last7">
            <SelectTrigger className="w-[130px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="last7">Last 7 days</SelectItem>
              <SelectItem value="last30">Last 30 days</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Single Color Bar Chart */}
        <div className="space-y-4">
          <div className="flex items-end justify-around h-64 gap-2">
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-teal-500 rounded-t-lg h-32"></div>
              <span className="text-xs text-gray-600 mt-2 text-center">
                Sales Purchase
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-cyan-400 rounded-t-lg h-48"></div>
              <span className="text-xs text-gray-600 mt-2 text-center">
                Down Payment
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-purple-500 rounded-t-lg h-36"></div>
              <span className="text-xs text-gray-600 mt-2 text-center">
                Sales Offer
              </span>
            </div>
            <div className="flex-1 flex flex-col items-center">
              <div className="w-full bg-orange-400 rounded-t-lg h-56"></div>
              <span className="text-xs text-gray-600 mt-2 text-center">
                Identification
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
