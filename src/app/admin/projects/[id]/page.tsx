"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  ChevronLeft,
  ChevronRight,
  Edit,
  Download,
  Building2,
  Star,
  Flag,
  CreditCard,
  Home,
  Plus,
  ExternalLink,
  Calendar,
  MapPin,
} from "lucide-react";
import { AddPaymentPlanModal } from "@/components/modals/add-payment-plan-modal";
import { EditPaymentPlanModal } from "@/components/modals/edit-payment-plan-modal";
import { DeleteFeatureModal } from "@/components/modals/delete-feature-modal";
import { PaymentPlanInput } from "@/validators/payment-plan.schema";
import { AddMilestoneModal } from "@/components/modals/add-milestone-modal";
import { AddBuildingModal } from "@/components/modals/add-building-modal";
import { EditBuildingModal } from "@/components/modals/edit-building-modal";
import { EditMilestoneModal } from "@/components/modals/edit-milestone-modal";
import {
  fetchProjectsDetails,
  editProject,
  editProjectFeature,
  deleteProjectFeature,
  deletePaymentPlan,
  deleteBuilding,
  deleteMilestone,
} from "@/data/api-client";
import { EditProjectInput } from "@/validators/edit-project.schema";
import type { AxiosError } from "axios";
import { EditProjectModal } from "@/components/modals/edit-project-modal";
import { AddProjectFeatureModal } from "@/components/modals/add-project-feature-modal";
import { EditProjectFeatureModal } from "@/components/modals/edit-project-feature-modal";
import { Trash2, Image as ImageIcon, Video as VideoIcon } from "lucide-react";
import { AddProjectMediaModal } from "@/components/modals/add-project-media-modal";
import { EditProjectMediaModal } from "@/components/modals/edit-project-media-modal";
import { DeleteProjectMediaModal } from "@/components/modals/delete-project-media-modal";
import { Palanquin } from "next/font/google";

interface Property {
  property_id: number;
  property_name: string;
  property_no: string;
  status: string;
  availability_status: string;
  construction_status: string;
  price: string;
  size: string;
  bedrooms: number;
  bathrooms: number;
  parking_spaces: number;
  furnish_status: string;
  finishing_status: string;
  propertytype?: {
    id: number;
    name: string;
  };
  propertysubtype?: {
    id: number;
    name: string;
  } | null;
}

interface Building {
  building_id: number;
  building_name: string;
  total_floors: number;
  total_units: number;
  construction_status: string;
  building_type: string;
  parking_spaces: number;
  description?: string;
  latitude?: string;
  longitude?: string;
  built_type?: string;
  completion_date?: string;
}

interface Feature {
  feature_id: number;
  feature_name: string;
  value: string;
  description: string | null;
  is_amenity: number;
  icons?: string | null;
}

interface Milestone {
  milestone_id: number;
  milestone_name: string;
  status: string;
  description: string;
  planned_start_date: string;
  planned_end_date: string;
  completion_percentage: number;
  actual_start_date?: string;
  actual_end_date?: string;
}

interface PaymentPlanItem {
  id?: number;
  payment_plan_item_id?: number;
  type: string;
  percentage: number;
  intervals?: number;
}

interface PaymentPlan {
  payment_plan_id: number;
  name: string;
  description?: string | null;
  payment_plan_type?: string;
  total_cost?: string;
  status?: string;
  period_by_years?: number | null;
  type?: string;
  paymentplanitems?: PaymentPlanItem[];
}

interface Media {
  media_id: number;
  media_url: string;
  media_type: string;
  description?: string;
  is_primary?: number;
  my_order?: number;
}

interface Developer {
  developer_id: number;
  name: string;
  email: string;
  phone_number: string;
  website: string;
  logo: string;
  description: string;
  status: string;
  is_top: number;
}

interface City {
  id: number;
  name: string;
  country?: {
    id: number;
    name: string;
    currency: string;
  };
}

interface Area {
  area_id: number;
  area_name: string;
  region?: string;
  latitude?: string;
  longitude?: string;
}

interface Location {
  location_id: number;
  google_map_link: string;
  north_side: string;
  south_side: string;
  east_side: string;
  west_side: string;
  landmark: string;
  description: string;
  latitude: string;
  longitude: string;
  city?: City;
  area?: Area;
}

interface ProjectData {
  project_id: number;
  project_name: string;
  project_type: string;
  total_units: number;
  available_units: number;
  launch_date: string;
  completion_date: string;
  status: string;
  price_range: string;
  price_range_SQ: string;
  description: string;
  project_size: string;
  phase: string | null;
  is_active: number;
  currency: string;
  permit_no: string | null;
  barcode: string | null;
  active_properties_count: number;
  available_properties_count: number;
  booked_properties_count: number;
  sold_properties_count: number;
  developer?: Developer;
  location?: Location;
  buildings: Building[];
  properties: Property[];
  features: Feature[];
  milestones: Milestone[];
  paymentPlans: PaymentPlan[];
}

export default function ProjectDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user?.accessToken;
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("buildings");
  const [selectedFeatures, setSelectedFeatures] = useState<number[]>([]);
  const [isPaymentPlanModalOpen, setIsPaymentPlanModalOpen] = useState(false);
  const [editingPaymentPlan, setEditingPaymentPlan] =
    useState<PaymentPlan | null>(null);
  const [isEditPaymentPlanModalOpen, setIsEditPaymentPlanModalOpen] =
    useState(false);
  const [paymentPlanToDelete, setPaymentPlanToDelete] =
    useState<PaymentPlan | null>(null);
  const [isDeletePaymentPlanModalOpen, setIsDeletePaymentPlanModalOpen] =
    useState(false);
  const [isMilestoneModalOpen, setIsMilestoneModalOpen] = useState(false);
  const [editingMilestone, setEditingMilestone] = useState<number | null>(null);
  const [isEditMilestoneModalOpen, setIsEditMilestoneModalOpen] =
    useState(false);
  const [milestoneToDelete, setMilestoneToDelete] = useState<number | null>(
    null,
  );
  const [isDeleteMilestoneModalOpen, setIsDeleteMilestoneModalOpen] =
    useState(false);
  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  const [editingBuilding, setEditingBuilding] = useState<number | null>(null);
  const [isEditBuildingModalOpen, setIsEditBuildingModalOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState<number | null>(null);
  const [isDeleteBuildingModalOpen, setIsDeleteBuildingModalOpen] =
    useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddFeatureModalOpen, setIsAddFeatureModalOpen] = useState(false);
  const [editingFeature, setEditingFeature] = useState<Feature | null>(null);
  const [isEditFeatureModalOpen, setIsEditFeatureModalOpen] = useState(false);
  const [featureToDelete, setFeatureToDelete] = useState<Feature | null>(null);
  const [isDeleteFeatureModalOpen, setIsDeleteFeatureModalOpen] =
    useState(false);

  // Media state
  const [isAddMediaModalOpen, setIsAddMediaModalOpen] = useState(false);
  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [isEditMediaModalOpen, setIsEditMediaModalOpen] = useState(false);
  const [mediaToDelete, setMediaToDelete] = useState<Media | null>(null);
  const [isDeleteMediaModalOpen, setIsDeleteMediaModalOpen] = useState(false);

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

  // Mutation for deleting project feature
  const deleteFeatureMutation = useMutation({
    mutationFn: (featureId: number) =>
      deleteProjectFeature(Number(id), featureId, token!),
    onSuccess: () => {
      toast.success("Feature deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectDetails", id] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to delete feature.",
      );
    },
  });

  // Mutation for deleting building
  const deleteBuildingMutation = useMutation({
    mutationFn: (buildingId: number) => deleteBuilding(buildingId, token!),
    onSuccess: () => {
      toast.success("Building deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectDetails", id] });
      setIsDeleteBuildingModalOpen(false);
      setBuildingToDelete(null);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to delete building.",
      );
    },
  });

  // Mutation for deleting milestone
  const deleteMilestoneMutation = useMutation({
    mutationFn: (milestoneId: number) => deleteMilestone(milestoneId, token!),
    onSuccess: () => {
      toast.success("Milestone deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectDetails", id] });
      setIsDeleteMilestoneModalOpen(false);
      setMilestoneToDelete(null);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to delete milestone.",
      );
    },
  });

  const handleDeleteFeature = (feature: Feature) => {
    setFeatureToDelete(feature);
    setIsDeleteFeatureModalOpen(true);
  };

  const confirmDeleteFeature = () => {
    if (featureToDelete) {
      deleteFeatureMutation.mutate(featureToDelete.feature_id);
      setIsDeleteFeatureModalOpen(false);
      setFeatureToDelete(null);
    }
  };

  // Mutation for deleting payment plan
  const deletePaymentPlanMutation = useMutation({
    mutationFn: (paymentPlanId: number) =>
      deletePaymentPlan(paymentPlanId, token!),
    onSuccess: () => {
      toast.success("Payment plan deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectDetails", id] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to delete payment plan.",
      );
    },
  });

  const handleEditPaymentPlan = (plan: PaymentPlan) => {
    setEditingPaymentPlan(plan);
    setIsEditPaymentPlanModalOpen(true);
  };

  const handleDeletePaymentPlan = (plan: PaymentPlan) => {
    setPaymentPlanToDelete(plan);
    setIsDeletePaymentPlanModalOpen(true);
  };

  const confirmDeletePaymentPlan = () => {
    if (paymentPlanToDelete) {
      deletePaymentPlanMutation.mutate(paymentPlanToDelete.payment_plan_id);
      setIsDeletePaymentPlanModalOpen(false);
      setPaymentPlanToDelete(null);
    }
  };
  const statusMutation = useMutation({
    mutationFn: (updatedData: any) =>
      editProject(Number(id), updatedData, token!),
    onSuccess: () => {
      toast.success("Project activation updated successfully!");
      queryClient.invalidateQueries({
        queryKey: ["projectDetails", id],
      });
      queryClient.invalidateQueries({ queryKey: ["Projects"] });
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{
        status?: string;
        errors?: Record<string, string>[];
        message?: string;
      }>;

      const errorList = axiosError?.response?.data?.errors;
      const flatMessages = errorList
        ? Object.values(errorList)
          .map((errObj) => Object.values(errObj))
          .flat()
          .join(", ")
        : "";

      const fallbackMessage =
        axiosError.response?.data?.message ||
        axiosError.message ||
        "Failed to update project activation.";

      toast.error(flatMessages || fallbackMessage);
    },
  });

  const handleStatusToggle = () => {
    if (!data) return;

    const newIsActive =
      data.is_active === "1" || data.is_active === 1 ? "0" : "1";

    const payload = {
      available_units: data.available_units,
      completion_date: data.completion_date,
      description: data.description,
      developer_id: data.developer?.developer_id,
      is_active: newIsActive,
      launch_date: data.launch_date,
      location: {
        area_id: data.location?.area?.area_name,
        city_id: data.location?.city?.name,
        east_side: data.location?.east_side,
        google_map_link: data.location?.google_map_link,
        landmark: data.location?.landmark,
        latitude: data.location?.latitude,
        longitude: data.location?.longitude,
        north_side: data.location?.north_side,
        south_side: data.location?.south_side,
        west_side: data.location?.west_side,
      },
      price_range: data.price_range,
      price_range_SQ: data.price_range_SQ,
      project_name: data.project_name,
      project_size: data.project_size,
      project_type: data.project_type,
      status: data.status,
      total_units: data.total_units,
    };

    statusMutation.mutate(payload);
  };

  // const handleAddPaymentPlan = (data: PaymentPlanInput) => {
  //   console.log("Adding payment plan:", data);
  //   // Here you would add the payment plan to your backend
  // };

  // const handleAddMilestone = (data: MilestoneFormData) => {
  //   console.log("Adding milestone:", data);
  //   // Here you would add the milestone to your backend
  // };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center text-gray-600">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-teal-600 border-r-transparent"></div>
          <p className="mt-4 text-sm">Loading project details...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (isError) {
    return (
      <div className="p-4 text-center text-red-500">
        <p className="text-lg font-semibold">Error loading project</p>
        <p className="mt-2 text-sm">{(error as Error).message}</p>
      </div>
    );
  }

  // No data state
  if (!data) {
    return (
      <div className="p-4 text-center text-gray-500">No data available</div>
    );
  }

  const buildings = data.buildings || [];
  const features = data.features || [];
  const milestones = data.milestones || [];
  const paymentPlans = data.paymentPlans || [];
  const isActive = data.is_active === 1;
  const currency = data?.location?.city?.country?.currency || "AED";

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Home</span>
        <ChevronRight className="h-4 w-4" />
        <span>Projects</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">Project Details</span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/projects")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">
            {data?.project_name}
          </h1>
          <div className="flex items-center gap-2">
            <Switch
              checked={isActive}
              onCheckedChange={handleStatusToggle}
              disabled={statusMutation.isPending}
            />
            <span className="text-sm text-gray-600">
              {statusMutation.isPending ? "Updating..." : "Active"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            className="bg-purple-600 hover:bg-purple-700 text-white gap-2"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          {/* <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
            <Download className="h-4 w-4" />
            Download PDF
          </Button> */}
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {data?.total_units || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">Total Units</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {data?.available_properties_count || data?.available_units || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">Available Units</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {data?.active_properties_count || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">Active Units</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {data?.booked_properties_count || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">Booked Units</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900">
            {data?.sold_properties_count || 0}
          </p>
          <p className="text-sm text-gray-600 mt-1">Sold Units</p>
        </div>
        <div className="bg-white rounded-lg border border-gray-200 p-4 text-center">
          <p className="text-2xl font-bold text-gray-900 capitalize">
            {data?.status || "N/A"}
          </p>
          <p className="text-sm text-gray-600 mt-1">Status</p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="space-y-6">
          {/* Developer Card */}
          {data.developer && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Developer
              </h3>
              <div className="flex items-start gap-3 mb-4">
                {data.developer.logo ? (
                  <img
                    src={data.developer.logo}
                    alt="Developer Logo"
                    width={48}
                    height={48}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-100 flex items-center justify-center text-lg font-bold text-gray-600">
                    {data.developer.name?.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {data.developer.name}
                  </h4>
                  <Badge className="bg-green-50 text-green-700 border-green-200 text-xs mt-1">
                    {data.developer.status || "Verified Developer"}
                  </Badge>
                </div>
              </div>
              <div className="space-y-2 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Email Address</span>
                  <span className="text-gray-900">{data.developer.email}</span>
                </div>
                {data.developer.website && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Website</span>
                    <span className="text-gray-900">
                      {data.developer.website}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone Number</span>
                  <span className="text-gray-900">
                    {data.developer.phone_number}
                  </span>
                </div>
              </div>
              {data.developer.description && (
                <p className="text-xs text-gray-600 mb-4">
                  {data.developer.description}
                </p>
              )}
              {/* <Button
                variant="outline"
                className="w-full text-purple-600 border-purple-600"
              >
                View All Projects
              </Button> */}
            </div>
          )}

          {/* Project Details Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Project Details
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Total Area</span>
                <span className="text-gray-900 font-medium">
                  {data.project_size || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Launch Date</span>
                <span className="text-gray-900 font-medium">
                  {data.launch_date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Delivery Date</span>
                <span className="text-gray-900 font-medium">
                  {data.completion_date}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Price Range</span>
                <span className="text-gray-900 font-medium">
                  {data.price_range}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Number of Buildings</span>
                <span className="text-gray-900 font-medium">
                  {buildings.length}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Project Type</span>
                <span className="text-gray-900 font-medium">
                  {data.project_type}
                </span>
              </div>
            </div>
          </div>

          {/* Location Card */}
          {data.location && (
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Location
              </h3>
              <div className="space-y-3 text-sm">
                {data.location.city && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">City</span>
                    <span className="text-gray-900 font-medium">
                      {data.location.city.name}
                    </span>
                  </div>
                )}
                {data.location.area && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Area</span>
                    <span className="text-gray-900 font-medium">
                      {data.location.area.area_name}
                    </span>
                  </div>
                )}
                {data.location.north_side && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">North Side</span>
                    <span className="text-gray-900 font-medium">
                      {data.location.north_side}
                    </span>
                  </div>
                )}
                {data.location.south_side && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">South Side</span>
                    <span className="text-gray-900 font-medium">
                      {data.location.south_side}
                    </span>
                  </div>
                )}
                {data.location.east_side && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">East Side</span>
                    <span className="text-gray-900 font-medium">
                      {data.location.east_side}
                    </span>
                  </div>
                )}
                {data.location.west_side && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">West Side</span>
                    <span className="text-gray-900 font-medium">
                      {data.location.west_side}
                    </span>
                  </div>
                )}
                {data.location.landmark && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-600 block mb-1">Landmark</span>
                    <span className="text-gray-900 text-xs">
                      {data.location.landmark}
                    </span>
                  </div>
                )}
                {data.location.latitude && data.location.longitude && (
                  <div className="pt-2 border-t border-gray-200">
                    <span className="text-gray-600 block mb-1">
                      Coordinates
                    </span>
                    <span className="text-gray-900 text-xs">
                      {data.location.latitude}° N, {data.location.longitude}° E
                    </span>
                  </div>
                )}
                {data.location.google_map_link && (
                  <a
                    href={data.location.google_map_link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 flex w-fit justify-between rounded-md bg-blue-500 px-4 py-2 text-white transition duration-300 hover:bg-blue-600"
                  >
                    View on Google Maps{" "}
                    <ExternalLink className="ml-1 h-4 w-4" />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Content - Tabbed Section */}
        <div className="lg:col-span-2">
          {/* About Project */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
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
          <div className="bg-white rounded-lg border border-gray-200">
            <div className="border-b border-gray-200 bg-gray-50 px-6 py-2">
              <div className="flex gap-1">
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
                    className={`flex items-center gap-2 px-4 py-3 text-sm font-medium rounded-t-lg transition-all ${activeTab === tab.id
                        ? "bg-white text-teal-600 border-t-2 border-teal-600 shadow-sm"
                        : "text-gray-600 hover:text-gray-900 hover:bg-white/50"
                      }`}
                  >
                    <tab.icon
                      className={`h-4 w-4 ${activeTab === tab.id ? "text-teal-600" : "text-gray-400"
                        }`}
                    />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tab Content */}
            <div className="p-6">
              {/* Buildings Tab */}
              {activeTab === "buildings" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Buildings ( {buildings.length} )
                    </h3>
                    <div className="flex gap-2">
                      {/* <Button
                        variant="outline"
                        className="gap-2 bg-purple-600 text-white hover:bg-purple-700"
                      >
                        <Download className="h-4 w-4" />
                        Export
                      </Button> */}
                      <Button
                        className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
                        onClick={() => setIsBuildingModalOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Building
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {buildings.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No buildings available
                      </div>
                    ) : (
                      buildings.map((building: Building, index: number) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {building.building_name}
                              </h4>
                              <p className="text-sm text-gray-500">
                                {building.total_floors} floors
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingBuilding(building.building_id);
                                  setIsEditBuildingModalOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setBuildingToDelete(building.building_id);
                                  setIsDeleteBuildingModalOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-4 gap-4">
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Total Units
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {building.total_units}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Status
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {building.construction_status}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">Type</p>
                              <p className="text-lg font-semibold text-gray-900">
                                {building.building_type}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-gray-500 mb-1">
                                Parking
                              </p>
                              <p className="text-lg font-semibold text-gray-900">
                                {building.parking_spaces}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Features Tab */}
              {activeTab === "features" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Project Features</h3>
                    <Button
                      className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
                      onClick={() => setIsAddFeatureModalOpen(true)}
                    >
                      <Plus className="h-4 w-4" />
                      Add New Project Feature
                    </Button>
                  </div>
                  {features.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      No features available
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead className="border-b border-gray-200 bg-gray-50">
                          <tr>
                            <th className="px-3 py-3 text-left">
                              <Checkbox />
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">
                              Feature Name
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">
                              Value
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">
                              Description
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">
                              Is Amenity
                            </th>
                            <th className="px-3 py-3 text-left text-xs font-semibold text-gray-900">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {features.map((feature: Feature) => (
                            <tr
                              key={feature.feature_id}
                              className="border-b border-gray-200 hover:bg-gray-50"
                            >
                              <td className="px-3 py-3">
                                <Checkbox
                                  checked={selectedFeatures.includes(
                                    feature.feature_id,
                                  )}
                                  onCheckedChange={(checked) => {
                                    if (checked) {
                                      setSelectedFeatures([
                                        ...selectedFeatures,
                                        feature.feature_id,
                                      ]);
                                    } else {
                                      setSelectedFeatures(
                                        selectedFeatures.filter(
                                          (id) => id !== feature.feature_id,
                                        ),
                                      );
                                    }
                                  }}
                                />
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-900">
                                {feature.feature_name}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-600">
                                {feature.value}
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-600">
                                {feature.description}
                              </td>
                              <td className="px-3 py-3">
                                <Badge
                                  className={
                                    feature.is_amenity
                                      ? "bg-green-50 text-green-700"
                                      : "bg-gray-50 text-gray-700"
                                  }
                                >
                                  {feature.is_amenity ? "Yes" : "No"}
                                </Badge>
                              </td>
                              <td className="px-3 py-3 text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0"
                                    onClick={() => {
                                      setEditingFeature(feature);
                                      setIsEditFeatureModalOpen(true);
                                    }}
                                  >
                                    <Edit className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                    onClick={() => handleDeleteFeature(feature)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* Milestones Tab */}
              {activeTab === "milestones" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">
                      Milestones ({milestones.length})
                    </h3>
                    <div className="flex gap-2">
                      {/* <Button
                        variant="outline"
                        className="gap-2 bg-purple-600 text-white hover:bg-purple-700"
                      >
                        <Download className="h-4 w-4" />
                        Export
                      </Button> */}
                      <Button
                        className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
                        onClick={() => setIsMilestoneModalOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Milestone
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-4">
                    {milestones.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No milestones available
                      </div>
                    ) : (
                      milestones.map((milestone: Milestone, index: number) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-start justify-between mb-3">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {milestone.milestone_name}
                              </h4>
                              <Badge className="bg-orange-50 text-orange-700 border-orange-200 text-xs mt-1">
                                {milestone.status}
                              </Badge>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setEditingMilestone(milestone.milestone_id);
                                  setIsEditMilestoneModalOpen(true);
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => {
                                  setMilestoneToDelete(milestone.milestone_id);
                                  setIsDeleteMilestoneModalOpen(true);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-red-500" />
                              </Button>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mb-3">
                            {milestone.description}
                          </p>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {milestone.planned_start_date} -{" "}
                              {milestone.planned_end_date}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span className="text-gray-600">
                                Completion Rate
                              </span>
                              <span className="font-semibold text-gray-900">
                                {milestone.completion_percentage}%
                              </span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-teal-600 h-2 rounded-full"
                                style={{
                                  width: `${milestone.completion_percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Payment Plans Tab */}
              {activeTab === "payment" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Payment Plans</h3>
                    <div className="flex gap-2">
                      {/* <Button
                        variant="outline"
                        className="gap-2 bg-purple-600 text-white hover:bg-purple-700"
                      >
                        <Download className="h-4 w-4" />
                        Export
                      </Button> */}
                      <Button
                        className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
                        onClick={() => setIsPaymentPlanModalOpen(true)}
                      >
                        <Plus className="h-4 w-4" />
                        Add Payment Plan
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-6">
                    {paymentPlans.length === 0 ? (
                      <div className="text-center py-12 text-gray-500">
                        No payment plans available
                      </div>
                    ) : (
                      paymentPlans.map((plan: PaymentPlan, index: number) => (
                        <div
                          key={index}
                          className="border border-gray-200 rounded-lg p-5"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h4 className="text-lg font-semibold text-gray-900">
                                {plan.name}
                              </h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {plan.description}
                              </p>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEditPaymentPlan(plan)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-600 hover:text-red-700"
                                onClick={() => handleDeletePaymentPlan(plan)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          {plan.total_cost && (
                            <div className="bg-gray-50 rounded-lg p-6 mb-4">
                              <p className="text-3xl font-bold text-gray-900 text-center">
                                {plan.total_cost} {currency}
                              </p>
                              <p className="text-sm text-gray-600 text-center mt-1">
                                Total Cost
                              </p>
                            </div>
                          )}
                          {plan.paymentplanitems && (
                            <div>
                              <p className="text-sm font-semibold text-gray-900 mb-3">
                                Payment Schedule
                              </p>
                              <div className="space-y-2">
                                {plan.paymentplanitems.map(
                                  (
                                    item: { type: string; percentage: number },
                                    idx: number,
                                  ) => (
                                    <div
                                      key={idx}
                                      className="flex items-center justify-between text-sm"
                                    >
                                      <span className="text-gray-600">
                                        {item.type}
                                      </span>
                                      <span className="font-medium text-gray-900">
                                        {item.percentage}%
                                      </span>
                                    </div>
                                  ),
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* Units Tab */}
              {activeTab === "units" && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-semibold">Properties/Units ({data.properties?.length || 0})</h3>
                  </div>
                  {data.properties && data.properties.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm text-left">
                        <thead className="border-b border-gray-200 bg-gray-50 text-gray-900 font-semibold">
                          <tr>
                            <th className="px-4 py-3">Unit No</th>
                            <th className="px-4 py-3">Type</th>
                            <th className="px-4 py-3">Price</th>
                            <th className="px-4 py-3">Size</th>
                            <th className="px-4 py-3">Beds/Baths/Parking</th>
                            <th className="px-4 py-3">Status</th>
                            <th className="px-4 py-3">Availability</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.properties.map((property: Property, index: number) => (
                            <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                              <td className="px-4 py-3 font-medium text-teal-600">{property.property_no}</td>
                              <td className="px-4 py-3">{property.propertytype?.name || "-"} - {property.propertysubtype?.name || "-"}</td>
                              <td className="px-4 py-3 font-medium">{Number(property.price).toLocaleString()} {currency}</td>
                              <td className="px-4 py-3">{property.size} sqm</td>
                              <td className="px-4 py-3 text-gray-500">
                                {property.bedrooms} Beds • {property.bathrooms} Baths • {property.parking_spaces} P
                              </td>
                              <td className="px-4 py-3">
                                <Badge className="bg-gray-100 text-gray-700 capitalize">{property.status}</Badge>
                              </td>
                              <td className="px-4 py-3">
                                <Badge className={property.availability_status === "available" ? "bg-green-100 text-green-700 capitalize" : "bg-red-100 text-red-700 capitalize"}>
                                  {property.availability_status}
                                </Badge>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-12">
                      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                        <Home className="h-8 w-8 text-gray-400" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">
                        0 units available
                      </h3>
                      <p className="text-sm text-gray-500 mb-6 text-center max-w-sm">
                        No units have been added to this project yet.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Project Images */}
          <div className="bg-white rounded-lg border border-gray-200 p-6 mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Project Media ({data.medias?.length || 0})
              </h3>
              <Button
                onClick={() => setIsAddMediaModalOpen(true)}
                className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Media
              </Button>
            </div>

            {data.medias && data.medias.length > 0 ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.medias.map((media: Media, index: number) => (
                  <div
                    key={media.media_id || index}
                    className="group relative aspect-video bg-gray-100 rounded-lg overflow-hidden border border-gray-200"
                  >
                    {media.media_type === "video" ? (
                      <video
                        src={media.media_url}
                        className="h-full w-full object-cover"
                        controls
                      />
                    ) : (
                      <img
                        src={media.media_url}
                        alt={media.description || "Project media"}
                        className="h-full w-full object-cover"
                      />
                    )}

                    {/* Overlay with actions */}
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => {
                          setEditingMedia(media);
                          setIsEditMediaModalOpen(true);
                        }}
                        className="p-2 bg-white rounded-full text-gray-700 hover:bg-gray-100"
                        title="Edit"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => {
                          setMediaToDelete(media);
                          setIsDeleteMediaModalOpen(true);
                        }}
                        className="p-2 bg-white rounded-full text-red-600 hover:bg-red-50"
                        title="Delete"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Media type badge */}
                    <div className="absolute top-2 left-2">
                      {media.media_type === "video" ? (
                        <span className="px-2 py-1 bg-blue-600 text-white text-xs rounded flex items-center gap-1">
                          <VideoIcon className="h-3 w-3" />
                          Video
                        </span>
                      ) : media.media_type === "floor_plan" ? (
                        <span className="px-2 py-1 bg-purple-600 text-white text-xs rounded">
                          Floor Plan
                        </span>
                      ) : media.media_type === "3D_tour" ? (
                        <span className="px-2 py-1 bg-orange-600 text-white text-xs rounded">
                          3D Tour
                        </span>
                      ) : (
                        <span className="px-2 py-1 bg-teal-600 text-white text-xs rounded flex items-center gap-1">
                          <ImageIcon className="h-3 w-3" />
                          Image
                        </span>
                      )}
                    </div>

                    {/* Primary badge */}
                    {media.is_primary === 1 && (
                      <div className="absolute top-2 right-2">
                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded">
                          Primary
                        </span>
                      </div>
                    )}

                    {/* Description */}
                    {media.description && (
                      <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2">
                        <p className="text-white text-xs truncate">
                          {media.description}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <ImageIcon className="h-12 w-12 mx-auto mb-2 text-gray-300" />
                <p>No media added yet. Click "Add Media" to get started.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddPaymentPlanModal
        isOpen={isPaymentPlanModalOpen}
        onClose={() => setIsPaymentPlanModalOpen(false)}
        projectId={Number(id)}
        developerId={data?.developer?.developer_id || 0}
        status="active"
      />
      {/* <EditPaymentPlanModal
        isOpen={isEditPaymentPlanModalOpen}
        onClose={() => {
          setIsEditPaymentPlanModalOpen(false);
          setEditingPaymentPlan(null);
        }}
        paymentPlan={editingPaymentPlan}
        projectId={Number(id)}
        developerId={data?.developer?.developer_id || 0}
      /> */}
      <DeleteFeatureModal
        isOpen={isDeletePaymentPlanModalOpen}
        onClose={() => {
          setIsDeletePaymentPlanModalOpen(false);
          setPaymentPlanToDelete(null);
        }}
        onConfirm={confirmDeletePaymentPlan}
        feature={{
          feature_id: paymentPlanToDelete?.payment_plan_id || 0,
          feature_name: paymentPlanToDelete?.name || "",
          value: paymentPlanToDelete?.total_cost?.toString() || "",
          description: paymentPlanToDelete?.description,
        }}
        isDeleting={deletePaymentPlanMutation.isPending}
      />
      <AddMilestoneModal
        isOpen={isMilestoneModalOpen}
        onClose={() => setIsMilestoneModalOpen(false)}
        projectId={Number(id)}
      />
      {/* <EditMilestoneModal
        milestoneId={editingMilestone!}
        projectId={Number(id)}
        isOpen={isEditMilestoneModalOpen}
        onClose={() => {
          setIsEditMilestoneModalOpen(false);
          setEditingMilestone(null);
        }}
      /> */}
      <DeleteFeatureModal
        isOpen={isDeleteMilestoneModalOpen}
        onClose={() => {
          setIsDeleteMilestoneModalOpen(false);
          setMilestoneToDelete(null);
        }}
        onConfirm={() => {
          if (milestoneToDelete) {
            deleteMilestoneMutation.mutate(milestoneToDelete);
          }
        }}
        feature={null}
        isDeleting={deleteMilestoneMutation.isPending}
      />
      <AddBuildingModal
        isOpen={isBuildingModalOpen}
        onClose={() => setIsBuildingModalOpen(false)}
        projectId={Number(id)}
      />
      {/* <EditBuildingModal
        buildingId={editingBuilding!}
        projectId={Number(id)}
        isOpen={isEditBuildingModalOpen}
        onClose={() => {
          setIsEditBuildingModalOpen(false);
          setEditingBuilding(null);
        }}
      /> */}
      <DeleteFeatureModal
        isOpen={isDeleteBuildingModalOpen}
        onClose={() => {
          setIsDeleteBuildingModalOpen(false);
          setBuildingToDelete(null);
        }}
        onConfirm={() => {
          if (buildingToDelete) {
            deleteBuildingMutation.mutate(buildingToDelete);
          }
        }}
        feature={null}
        isDeleting={deleteBuildingMutation.isPending}
      />
      {/* <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        projectId={Number(id)}
      /> */}
      <AddProjectFeatureModal
        isOpen={isAddFeatureModalOpen}
        onClose={() => setIsAddFeatureModalOpen(false)}
        projectId={Number(id)}
      />
      {/* <EditProjectFeatureModal
        isOpen={isEditFeatureModalOpen}
        onClose={() => {
          setIsEditFeatureModalOpen(false);
          setEditingFeature(null);
        }}
        projectId={Number(id)}
        feature={editingFeature as any}
      /> */}
      <DeleteFeatureModal
        isOpen={isDeleteFeatureModalOpen}
        onClose={() => {
          setIsDeleteFeatureModalOpen(false);
          setFeatureToDelete(null);
        }}
        onConfirm={confirmDeleteFeature}
        feature={featureToDelete}
        isDeleting={deleteFeatureMutation.isPending}
      />

      {/* Media Modals */}
      <AddProjectMediaModal
        isOpen={isAddMediaModalOpen}
        onClose={() => setIsAddMediaModalOpen(false)}
        projectId={Number(id)}
      />
      {/* <EditProjectMediaModal
        isOpen={isEditMediaModalOpen}
        onClose={() => {
          setIsEditMediaModalOpen(false);
          setEditingMedia(null);
        }}
        projectId={Number(id)}
        media={editingMedia}
      /> */}
      <DeleteProjectMediaModal
        isOpen={isDeleteMediaModalOpen}
        onClose={() => {
          setIsDeleteMediaModalOpen(false);
          setMediaToDelete(null);
        }}
        projectId={Number(id)}
        media={mediaToDelete}
      />
    </div>
  );
}

