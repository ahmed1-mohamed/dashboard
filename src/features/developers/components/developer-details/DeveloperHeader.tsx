import React from "react";
import { Button } from "@/components/ui/button";
import { Phone, Download, Edit, Star } from "lucide-react";
import { DeveloperData } from "@/features/developers/types";

interface DeveloperHeaderProps {
  developer: DeveloperData;
}

export function DeveloperHeader({ developer }: DeveloperHeaderProps) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-start gap-4">
        {developer.logo ? (
          <img
            src={developer.logo}
            alt={developer.name}
            className="w-16 h-16 rounded-lg object-contain"
            onError={(e) => (e.currentTarget.style.display = "none")}
          />
        ) : (
          <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center text-2xl font-bold text-gray-600">
            {developer.name?.substring(0, 2).toUpperCase()}
          </div>
        )}
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-gray-900">
              {developer.name}
            </h2>
            {developer.is_top === 1 && (
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            )}
          </div>
          <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <span
                className={`inline-flex h-2 w-2 rounded-full ${
                  developer.status === "active"
                    ? "bg-green-500"
                    : "bg-gray-400"
                }`}
              />
              <span className="capitalize">{developer.status}</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="outline" className="gap-2">
          <Phone className="h-4 w-4" />
          Contact
        </Button>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Developer
        </Button>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
        >
          <Edit className="h-4 w-4" />
          Edit
        </Button>
      </div>
    </div>
  );
}
