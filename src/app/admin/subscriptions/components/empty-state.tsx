import { Search } from "lucide-react";

export const EmptyState = ({
  title = "No items found",
  message = "There are no items available at the moment.",
}: {
  title?: string;
  message?: string;
}) => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="bg-gray-100 p-4 rounded-full mb-4">
      <Search className="w-8 h-8 text-gray-400" />
    </div>
    <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
    <p className="text-gray-500 mb-4">{message}</p>
  </div>
);
