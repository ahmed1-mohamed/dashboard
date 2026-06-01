"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { addProject, addProjectMedia } from "@/data/api-client";
import { CreateProjectInput } from "@/validators/create-project.schema";

interface CreateProjectParams extends CreateProjectInput {
  price_range: string;
  price_range_SQ: string;
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
  media?: {
    mediaItems: Array<{
      description: string;
      is_primary: boolean;
      my_order: boolean;
      media_type: "image" | "video" | "floor_plan" | "3D_tour";
      media_url?: string;
      file?: File;
    }>;
  };
}

export function useProjectActions() {
  // const { data: session } = useSession();
  // const token = session?.user?.accessToken;

  // const createMutation = useMutation({
  //   mutationFn: async (data: CreateProjectParams) => {
  //     if (!token) throw new Error("Not authenticated");

  //     // Create the project
  //     const projectResponse = await addProject(data as CreateProjectInput, token);
  //     const projectId = projectResponse.data?.project_id;

  //     // If media is provided, upload it
  //     if (data.media && data.media.mediaItems.length > 0 && projectId) {
  //       const formData = new FormData();
  //       formData.append("project_id", projectId.toString());

  //       const imageItems = data.media.mediaItems.filter(
  //         (item) =>
  //           item.media_type === "image" ||
  //           item.media_type === "floor_plan" ||
  //           item.media_type === "3D_tour",
  //       );
  //       const videoItems = data.media.mediaItems.filter(
  //         (item) => item.media_type === "video",
  //       );
  //       const orderedItems = [...imageItems, ...videoItems];

  //       imageItems.forEach((item) => {
  //         if (item.file) {
  //           formData.append("medias[]", item.file);
  //         }
  //       });

  //       const mediaMeta = orderedItems.map((item) => ({
  //         description: item.description,
  //         is_primary: item.is_primary ? 1 : 0,
  //         my_order: item.my_order ? 1 : 0,
  //         media_type: item.media_type,
  //         ...(item.media_type === "video" && { media_url: item.media_url }),
  //       }));
  //       formData.append("media_meta", JSON.stringify(mediaMeta));

  //       await addProjectMedia(formData, token);
  //     }

  //     return projectResponse;
  //   },
  // });

  // return {
  //   createProject: createMutation.mutateAsync,
  //   isCreating: createMutation.isPending,
  // };
}
