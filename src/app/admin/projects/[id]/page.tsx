"use client";

import { use, useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import { Building2, Star, Flag, CreditCard, Home } from "lucide-react";
import { fetchProjectsDetails } from "@/data/api-client";
import { ProjectHeader } from "./components/ProjectHeader";
import { ProjectStats } from "./components/ProjectStats";
import { ProjectSidebar } from "./components/ProjectSidebar";
import { BuildingsTab } from "./components/tabs/BuildingsTab";
import { FeaturesTab } from "./components/tabs/FeaturesTab";
import { MilestonesTab } from "./components/tabs/MilestonesTab";
import { PaymentPlansTab } from "./components/tabs/PaymentPlansTab";
import { UnitsTab } from "./components/tabs/UnitsTab";
import { ProjectMedia } from "./components/ProjectMedia";

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [activeTab, setActiveTab] = useState("buildings");

  // Fetch project details
  const { data, isError, error, isLoading } = useQuery({
    queryKey: ["projectDetails", id],
    queryFn: () => fetchProjectsDetails(Number(id), token!),
    enabled: !!token,
    select: (response: any) => {
      console.log("QUERY RESPONSE:", response);
      if (response?.data && response.data.project_id) {
        return response.data;
      }
      return response?.data || response;
    },
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-600 border-t-transparent"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="p-6">
        <div className="bg-red-50 text-red-600 p-4 rounded-lg">
          Error loading project details: {(error as any).message}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="p-6">
        <div className="text-gray-500">Project not found.</div>
      </div>
    );
  }

  const buildings = data.buildings || [];
  const features = data.features || [];
  const milestones = data.milestones || [];
  const paymentPlans = data.paymentPlans || [];
  const medias = data.medias || [];
  const properties = data.properties || [];

  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-[1600px] mx-auto min-h-screen bg-slate-50 text-slate-800 font-sans">
      <ProjectHeader projectId={Number(id)} token={token!} data={data} />
      <ProjectStats data={data} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mt-8">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <ProjectSidebar data={data} buildingsCount={buildings.length} />
        </div>

        {/* Right Content - Tabbed Section */}
        <div className="lg:col-span-2 flex flex-col gap-8">
          {/* About Project */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 p-6 sm:p-8 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">
              About Project
            </h3>
            <div
              className="text-sm text-gray-600 leading-relaxed"
              dangerouslySetInnerHTML={{
                __html: data.description || "No description available",
              }}
            />
          </div>

          {/* Tabs */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
            <div className="border-b border-slate-200/60 bg-slate-50/50 px-4 sm:px-6 pt-3 overflow-x-auto hide-scrollbar">
              <div className="flex gap-2 min-w-max pb-px">
                {[
                  { id: "buildings", label: "Buildings", icon: Building2 },
                  { id: "features", label: "Features", icon: Star },
                  { id: "milestones", label: "Milestones", icon: Flag },
                  { id: "payment", label: "Payment Plans", icon: CreditCard },
                  { id: "units", label: "Units", icon: Home },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-5 py-3 text-sm font-medium rounded-t-xl transition-all relative ${
                      activeTab === tab.id
                        ? "bg-white text-teal-700 shadow-sm before:absolute before:bottom-0 before:left-0 before:w-full before:h-0.5 before:bg-teal-600"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/50"
                    }`}
                  >
                    <tab.icon
                      className={`h-4 w-4 transition-colors ${
                        activeTab === tab.id ? "text-teal-600" : "text-slate-400"
                      }`}
                    />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-4 sm:p-6 overflow-x-auto">
              {activeTab === "buildings" && (
                <BuildingsTab projectId={Number(id)} token={token!} buildings={buildings} />
              )}

              {activeTab === "features" && (
                <FeaturesTab projectId={Number(id)} token={token!} features={features} />
              )}

              {activeTab === "milestones" && (
                <MilestonesTab projectId={Number(id)} token={token!} milestones={milestones} />
              )}

              {activeTab === "payment" && (
                <PaymentPlansTab
                  projectId={Number(id)}
                  developerId={data.developer?.developer_id || 0}
                  token={token!}
                  paymentPlans={paymentPlans}
                  currency={data.currency}
                />
              )}

              {activeTab === "units" && (
                <UnitsTab properties={properties} currency={data.currency} />
              )}
            </div>
          </div>

          <ProjectMedia projectId={Number(id)} medias={medias} />
        </div>
      </div>
    </div>
  );
}