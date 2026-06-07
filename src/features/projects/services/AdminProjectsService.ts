import { apiClient } from "@/lib/apiClient";
import { CreateProjectInput } from "@/validators/create-project.schema";

interface CreateProjectResponse {
  data?: {
    project_id?: number;
    project_name?: string;
  };
}

interface MediaItem {
  file?: File;
  description: string;
  is_primary: boolean;
  my_order: boolean;
  media_type: "image" | "video" | "floor_plan" | "3D_tour";
  media_url?: string;
}

export interface CreateProjectWithMediaParams extends CreateProjectInput {
  location: {
    latitude: number;
    longitude: number;
    landmark: string;
    city_id: string;
    north_side: string;
    south_side: string;
    east_side: string;
    west_side: string;
    google_map_link: string;
    area_id?: string;
  };
  mediaItems: MediaItem[];
}

export interface CreateProjectResult {
  projectId: number;
  projectName: string;
}

export const AdminProjectsService = {
  getProjectsPaginated: async (
    page: number = 1,
    perPage: number = 10,
    search?: string,
    status?: string,
    projectType?: string,
  ) => {
    const params = new URLSearchParams({
      page: page.toString(),
      per_page: perPage.toString(),
    });
    if (search) params.append("search", search);
    if (status && status !== "all") params.append("status", status);
    if (projectType && projectType !== "all") params.append("project_type", projectType);
    const response = await apiClient.get(`/dashboard/projects?${params.toString()}`);
    return response.data;
  },

  getProject: async (projectId: number) => {
    const response = await apiClient.get(`/dashboard/projects/${projectId}`);
    return response.data;
  },

  createProject: async (
    data: CreateProjectInput,
  ): Promise<CreateProjectResponse> => {
    const response = await apiClient.post("/dashboard/projects", data);
    return response.data as CreateProjectResponse;
  },

  createProjectMedia: async (formData: FormData) => {
    const response = await apiClient.post(
      "/dashboard/projects/medias/create",
      formData,
    );
    return response.data;
  },

  createProjectWithMedia: async (
    params: CreateProjectWithMediaParams,
  ): Promise<CreateProjectResult> => {
    const { mediaItems, location, ...projectData } = params;

    const flattenedProjectData = {
      ...projectData,
      latitude: location.latitude,
      longitude: location.longitude,
      landmark: location.landmark,
      city_id: location.city_id,
      north_side: location.north_side,
      south_side: location.south_side,
      east_side: location.east_side,
      west_side: location.west_side,
      google_map_link: location.google_map_link,
      ...(location.area_id && { area_id: location.area_id }),
    };

    const projectResponse = await AdminProjectsService.createProject(
      flattenedProjectData as CreateProjectInput,
    );

    const projectId = projectResponse.data?.project_id;
    const projectName = projectResponse.data?.project_name || "Project";

    if (!projectId) {
      throw new Error("Project creation failed: no project ID returned");
    }

    if (mediaItems.length > 0) {
      const formData = new FormData();
      formData.append("project_id", projectId.toString());

      const imageItems = mediaItems.filter(
        (item) =>
          item.media_type === "image" ||
          item.media_type === "floor_plan" ||
          item.media_type === "3D_tour",
      );

      const videoItems = mediaItems.filter(
        (item) => item.media_type === "video",
      );

      const orderedItems = [...imageItems, ...videoItems];

      imageItems.forEach((item) => {
        if (item.file) {
          formData.append("medias[]", item.file);
        }
      });

      const mediaMeta = orderedItems.map((item) => ({
        description: item.description,
        is_primary: item.is_primary ? 1 : 0,
        my_order: item.my_order ? 1 : 0,
        media_type: item.media_type,
        ...(item.media_type === "video" && { media_url: item.media_url }),
      }));

      formData.append("media_meta", JSON.stringify(mediaMeta));

      await AdminProjectsService.createProjectMedia(formData as FormData);
    }

    return { projectId, projectName };
  },

  updateProject: async (projectId: number, data: Record<string, unknown>) => {
    const response = await apiClient.post(`/dashboard/projects/${projectId}`, { ...data, _method: "PUT" });
    return response.data;
  },

  deleteProject: async (projectId: number) => {
    const response = await apiClient.delete(`/dashboard/projects/${projectId}`);
    return response.data;
  },

  toggleActive: async (projectId: number, isActive: boolean) => {
    // Fetch project data to satisfy full validation
    const projectResponse = await AdminProjectsService.getProject(projectId);
    const raw = (projectResponse as any).data ?? projectResponse;

    let mappedProjectType = raw.project_type ?? "residential";
    const lowerType = mappedProjectType.toLowerCase();
    if (lowerType === "mixed use" || lowerType === "mixed-use") mappedProjectType = "mixed-use";
    else if (lowerType === "residential") mappedProjectType = "residential";
    else if (lowerType === "commercial") mappedProjectType = "commercial";

    const cityId = String(raw.location?.city?.id || raw.location?.city_id || "1");
    const areaId = String(raw.location?.area?.area_id || raw.location?.area_id || "1");
    const developerId = String(raw.developer?.developer_id || raw.developer_id || "1");

    const payload: Record<string, unknown> = {
      project_name: raw.project_name || "Project",
      status: raw.status || "ongoing",
      project_type: mappedProjectType,
      developer_id: developerId,
      is_active: isActive ? "1" : "0",
      is_visible: isActive ? "1" : "0",
    };

    if (raw.total_units != null) payload.total_units = String(raw.total_units);
    if (raw.available_units != null) payload.available_units = String(raw.available_units);
    if (raw.launch_date) payload.launch_date = raw.launch_date;
    if (raw.completion_date) payload.completion_date = raw.completion_date;
    if (raw.currency) payload.currency = raw.currency;
    if (raw.project_size) payload.project_size = String(raw.project_size);
    if (raw.description) payload.description = raw.description;
    if (raw.price_range) payload.price_range = String(raw.price_range);
    if (raw.price_range_SQ) payload.price_range_SQ = String(raw.price_range_SQ);

    payload.location = {
      latitude: raw.location?.latitude ?? 0,
      longitude: raw.location?.longitude ?? 0,
      landmark: raw.location?.landmark || "",
      city_id: cityId,
      area_id: areaId,
      north_side: raw.location?.north_side || "",
      south_side: raw.location?.south_side || "",
      east_side: raw.location?.east_side || "",
      west_side: raw.location?.west_side || "",
      google_map_link: raw.location?.google_map_link || "",
    };

    const response = await apiClient.post(`/dashboard/projects/${projectId}`, payload);
    return response.data;
  },

  updateMilestone: async (
    milestoneId: number,
    data: {
      project_id: number;
      milestone_name?: string;
      description?: string;
      status?: "pending" | "in_progress" | "completed";
      actual_start_date?: string;
      actual_end_date?: string;
      planned_start_date?: string;
      planned_end_date?: string;
      completion_percentage?: number;
    }
  ) => {
    const response = await apiClient.put(`/dashboard/milestones/${milestoneId}`, data);
    return response.data;
  },
};
