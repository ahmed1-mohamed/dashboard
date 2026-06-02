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
  /**
   * Get projects with pagination and filters
   */
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

  /**
   * Get project by ID
   */
  getProject: async (projectId: number) => {
    const response = await apiClient.get(`/dashboard/projects/${projectId}`);
    return response.data;
  },

  /**
   * Create a new project
   */
  createProject: async (
    data: CreateProjectInput,
  ): Promise<CreateProjectResponse> => {
    const response = await apiClient.post("/dashboard/projects", data);
    return response.data as CreateProjectResponse;
  },

  /**
   * Create project media
   */
  createProjectMedia: async (formData: FormData) => {
    const response = await apiClient.post(
      "/dashboard/projects/medias/create",
      formData,
    );
    return response.data;
  },

  /**
   * Create project with media (combines project creation and media upload)
   */
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

  /**
   * Update a project
   * Note: The backend uses POST (not PUT) for project updates
   */
  updateProject: async (projectId: number, data: Record<string, unknown>) => {
    const response = await apiClient.post(`/dashboard/projects/${projectId}`, data);
    return response.data;
  },

  /**
   * Delete a project
   */
  deleteProject: async (projectId: number) => {
    const response = await apiClient.delete(`/dashboard/projects/${projectId}`);
    return response.data;
  },


  toggleVisibility: async (projectId: number, isVisible: boolean) => {
    const response = await apiClient.post(`/dashboard/projects/${projectId}`, {
      is_visible: isVisible ? 1 : 0,
    });
    return response.data;
  },
};
