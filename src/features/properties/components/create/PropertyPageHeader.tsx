"use client";

import { Button } from "@/components/ui/button";

interface PropertyPageHeaderProps {
  onCancel: () => void;
}

export default function PropertyPageHeader({ onCancel }: PropertyPageHeaderProps) {
  return (
    <div className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between max-w-7xl mx-auto">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Create New Property
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Home &gt; Properties &gt; Create Property
          </p>
        </div>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
}
