"use client";

import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { deleteBuilding } from "@/data/api-client";
import { Building } from "../../types";
import { AddBuildingModal } from "@/components/modals/add-building-modal";
import { DeleteFeatureModal } from "@/components/modals/delete-feature-modal";
import type { AxiosError } from "axios";

// import { EditBuildingModal } from "@/components/modals/edit-building-modal";

interface BuildingsTabProps {
  projectId: number;
  token: string;
  buildings: Building[];
}

export function BuildingsTab({ projectId, token, buildings }: BuildingsTabProps) {
  const queryClient = useQueryClient();

  const [isBuildingModalOpen, setIsBuildingModalOpen] = useState(false);
  // const [editingBuilding, setEditingBuilding] = useState<number | null>(null);
  // const [isEditBuildingModalOpen, setIsEditBuildingModalOpen] = useState(false);
  const [buildingToDelete, setBuildingToDelete] = useState<number | null>(null);
  const [isDeleteBuildingModalOpen, setIsDeleteBuildingModalOpen] = useState(false);

  // Mutation for deleting building
  const deleteBuildingMutation = useMutation({
    mutationFn: (buildingId: number) => deleteBuilding(buildingId, token),
    onSuccess: () => {
      toast.success("Building deleted successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectDetails", projectId.toString()] });
      setIsDeleteBuildingModalOpen(false);
      setBuildingToDelete(null);
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>;
      toast.error(
        axiosError?.response?.data?.message || "Failed to delete building."
      );
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          Buildings ( {buildings.length} )
        </h3>
        <div className="flex gap-2">
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
          buildings.map((building, index) => (
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
                      // setEditingBuilding(building.building_id);
                      // setIsEditBuildingModalOpen(true);
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

      <AddBuildingModal
        isOpen={isBuildingModalOpen}
        onClose={() => setIsBuildingModalOpen(false)}
        projectId={projectId}
      />
      
      {/* <EditBuildingModal
        buildingId={editingBuilding!}
        projectId={projectId}
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
    </div>
  );
}
