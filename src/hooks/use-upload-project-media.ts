"use client";

import { useMutation } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { addProjectMedia } from "@/data/api-client";

export default function useUploadProjectMedia() {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const uploadMutation = useMutation({
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    mutationFn: async ({
      projectId: _projectId,
      mediaData,
    }: {
      projectId: number;
      mediaData: any;
    }) => {
      if (!token) throw new Error("Not authenticated");
      return addProjectMedia(mediaData, token);
    },
  });

  return {
    uploadMedia: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
  };
}
