'use client'

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { ClockIcon, DollarSign, Home, Loader, ShieldIcon } from "lucide-react";
import { lazy, Suspense } from "react";

const AccountInfo = lazy(() => import("./AccountProfile/AccountInfo"));
const Security = lazy(() => import("./Security"));
const Availability = lazy(() => import("./Availability"));
const Pricing = lazy(() => import("./Package/Pricing"));

export default function TabsDemo() {
  return (
    <div>
      <h2 className="text-[#15042B] text-xl font-semibold mb-5">
        Account Settings
      </h2>

      <Tabs defaultValue="account-info" className="flex flex-col gap-6">
        <TabsList className="gap-1 bg-[#FFFFFF] border border-[#E5E7EB] rounded-xl w-full">
          <TabsTrigger
            value="account-info"
            className="flex items-center gap-1.5 rounded-lg py-2.5 px-4 text-sm text-[#15042B] data-[state=active]:bg-[#F9FAFB] data-[state=active]:text-[#15042B] transition-all"
          >
            <Home />
            Account info
          </TabsTrigger>

          {/* <TabsTrigger
            value="security"
            className="flex items-center gap-1.5 rounded-lg py-2.5 px-4 text-sm text-[#15042B] data-[state=active]:bg-[#F9FAFB] data-[state=active]:text-[#15042B] transition-all"
          >
            <ShieldIcon />
            Security
          </TabsTrigger> */}

          <TabsTrigger
            value="availability"
            className="flex items-center gap-1.5 rounded-lg py-2.5 px-4 text-sm text-[#15042B] data-[state=active]:bg-[#F9FAFB] data-[state=active]:text-[#15042B] transition-all"
          >
            <ClockIcon />
            Availability
          </TabsTrigger>

          {/* <TabsTrigger
            value="video-integration"
            className="flex items-center gap-1.5 rounded-lg py-2.5 px-4 text-sm text-[#15042B] data-[state=active]:bg-[#F9FAFB] data-[state=active]:text-[#15042B] transition-all"
          >
            <VideoIcon />
            Video platform
          </TabsTrigger> */}

          <TabsTrigger
            value="pricing"
            className="flex items-center gap-1.5 rounded-lg py-2.5 px-4 text-sm text-[#15042B] data-[state=active]:bg-[#F9FAFB] data-[state=active]:text-[#15042B] transition-all"
          >
            <DollarSign />
            Pricing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account-info">
          <Suspense fallback={<Loader />}>
            <AccountInfo />
          </Suspense>
        </TabsContent>

        {/* <TabsContent value="security">
          <Suspense fallback={<Loader />}>
            <Security />
          </Suspense>
        </TabsContent> */}

        <TabsContent value="availability">
          <Suspense fallback={<Loader />}>
            <Availability />
          </Suspense>
        </TabsContent>

        {/* <TabsContent value="video-integration">
          <Suspense fallback={<Loader />}>
            <VideoIntegration />
          </Suspense>
        </TabsContent> */}

        <TabsContent value="pricing">
          <Suspense fallback={<Loader />}>
            <Pricing />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
}
