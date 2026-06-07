"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { fetchAd } from "@/data/api-client";
import { ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import {
  AdBasicInfo,
  AdDetailsSection,
  AdCTADetails,
  AdImage,
  AdPlacementDetails,
  AdEntityDetails,
  AdTimestamps,
} from "@/features/ads/components/view/AdViewSections";

export default function ViewAdPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [adDetails, setAdDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id && session?.user?.accessToken) {
      fetchAdDetails();
    }
  }, [id, session]);

  const fetchAdDetails = async () => {
    if (!session?.user?.accessToken || !id) return;

    setLoading(true);
    try {
      const response = await fetchAd(id as string, session.user.accessToken);
      const actualData = (response as any)?.data || response;
      setAdDetails(actualData);
    } catch (error: any) {
      console.error("Error fetching ad details:", error);
      toast.error(error?.response?.data?.message || "Failed to load ad details");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
          <p className="mt-4 text-sm text-gray-600">Loading ad details...</p>
        </div>
      </div>
    );
  }

  if (!adDetails && !loading) {
    return (
      <div className="p-6">
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ads
        </Button>
        <div className="text-center py-12 text-gray-500">Ad not found</div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-8xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Ads
        </Button>
        <Button
          className="bg-teal-600 hover:bg-teal-700 text-white"
          onClick={() => router.push(`/admin/ads/${id}/edit`)}
        >
          Edit Ad
        </Button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-6">
        {/* Ad Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-teal-100 flex items-center justify-center">
              <span className="text-teal-600 font-semibold text-lg">
                {(adDetails?.placement?.format || "A").charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900">
                {adDetails?.title || adDetails?.creative_title || "Untitled Ad"}
              </h3>
              <p className="text-sm text-gray-500">
                ID: {adDetails?.creative_id}
              </p>
            </div>
          </div>
          <Badge
            variant={adDetails?.status === "active" ? "success" : "secondary"}
            className={
              adDetails?.status === "active"
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }
          >
            {adDetails?.status === "active" ? "Active" : "Inactive"}
          </Badge>
        </div>

        {/* Sections */}
        <AdBasicInfo adDetails={adDetails} />
        <AdDetailsSection adDetails={adDetails} />
        <AdCTADetails adDetails={adDetails} />
        <AdImage adDetails={adDetails} />
        <AdPlacementDetails adDetails={adDetails} />
        <AdEntityDetails adDetails={adDetails} />
        <AdTimestamps adDetails={adDetails} />
      </div>
    </div>
  );
}
