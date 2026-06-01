import { Button } from "@/components/ui";
import { Card } from "@/components/ui/card";
import { useToken } from "@/contexts/SessionProviderWrapper";
import { usePackages } from "@/hooks/dashboardExpert/usePackage";
import { DashboardExpertService } from "@/services/DashboardExpertService";
import { Package, PackageFormData } from "@/types/expertDashboard/package";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Pencil, Trash2 } from "lucide-react";
import { useState } from "react";
import PackageFormDialog from "./PackageFormDialog";

const emptyForm: PackageFormData = {
  name: "",
  minutes: "",
  price_cents: "",
  currency: "AED",
  is_active: true,
};

export default function Pricing() {
  const { expertId } = useToken();
  const queryClient = useQueryClient();
  const { data, isLoading } = usePackages(expertId);
  const packages: Package[] = data?.data?.data ?? [];

  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [addOpen, setAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Package | null>(null);

  const invalidate = () =>
    queryClient.invalidateQueries({ queryKey: ["packages", expertId] });

  const addMutation = useMutation({
    mutationFn: (form: PackageFormData) => {
      if (!expertId) throw new Error("expertId is required");
      return DashboardExpertService.addPackage(expertId, {
        expert_id: expertId,
        name: form.name,
        minutes: form.minutes,
        price_cents: form.price_cents,
        currency: form.currency,
        is_active: form.is_active,
      });
    },
    onSuccess: () => {
      invalidate();
      setAddOpen(false);
    },
  });

  const editMutation = useMutation({
    mutationFn: (form: PackageFormData) => {
      if (!expertId) throw new Error("expertId is required");
      return DashboardExpertService.updatePackage(expertId, editTarget!.package_id, {
        expert_id: expertId,
        name: form.name,
        minutes: form.minutes,
        price_cents: form.price_cents,
        currency: form.currency,
        is_active: form.is_active,
      });
    },
    onSuccess: () => {
      invalidate();
      setEditTarget(null);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (packageId: number) => {
      setDeletingId(packageId);
      if (!expertId) throw new Error("expertId is required");
      return DashboardExpertService.deletePackage(expertId, packageId);
    },
    onSuccess: () => {
      invalidate();
      setDeletingId(null);
    },
    onError: () => setDeletingId(null),
  });

  return (
    <>
      <div className="border border-[#E5E7EB] rounded-[8px] p-6 flex flex-col gap-6 bg-white shadow-[0px_1px_0.5px_0.05px_rgba(29, 41, 61, 0.02)]">
        <div className="flex justify-between items-center">
          <h2 className="text-[20px] font-semibold text-[#15042B]">Pricing</h2>
          <Button
            className="bg-[#008081] py-2.5 px-4 rounded-[8px] text-[#FFFFFF] tracking-normal font-medium text-[14px] leading-5 transition-colors duration-200"
            onClick={() => setAddOpen(true)}
          >
            Add Package
          </Button>
        </div>
        <div className="flex flex-col gap-3 w-[581px] m-auto">
          {isLoading && (
            <p className="text-center text-[14px] text-[#9CA3AF] py-4">Loading…</p>
          )}
          {!isLoading && packages.length === 0 && (
            <p className="text-center text-[14px] text-[#9CA3AF] py-4">No packages yet. Click "Add Package" to get started.</p>
          )}
          {packages.map((pkg) => (
            <Card
              key={pkg.package_id}
              className="rounded-[10px] border border-[#E5E7EB] bg-white shadow-[0_1px_2px_rgba(0,0,0,0.05)] px-4 py-3 flex flex-col gap-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex flex-col gap-[15px]">
                  <p className="text-[#15042B] text-[16px] leading-[20px] font-[400]">{pkg.name}</p>
                  <span className="bg-[#ECFDF5] rounded-[6px] py-[2px] px-[6px] font-medium text-xs leading-4 tracking-normal text-[#007A55]">
                    {(pkg.price_cents).toLocaleString()} {pkg.currency} / {pkg.minutes} Min
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setEditTarget(pkg)}
                    className="flex items-center gap-1 text-[13px] font-[500] text-[#374151] border border-[#E5E7EB] rounded-md py-2 px-3 bg-white hover:bg-[#F9FAFB] transition-colors shadow-[0_1px_1px_rgba(0,0,0,0.04)]"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                    Edit
                  </button>
                  <button
                    onClick={() => deleteMutation.mutate(pkg.package_id)}
                    disabled={deletingId === pkg.package_id}
                    className="py-2.5 px-4 rounded-md bg-[#C70036] text-white hover:bg-[#a8002d] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    title="Remove package"
                  >
                    {deletingId === pkg.package_id ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
                    ) : (
                      <Trash2 className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <PackageFormDialog
        open={addOpen}
        onOpenChange={setAddOpen}
        initial={emptyForm}
        onSubmit={(form) => addMutation.mutate(form)}
        loading={addMutation.isPending}
        mode="add"
      />

      <PackageFormDialog
        open={!!editTarget}
        onOpenChange={(open) => { if (!open) setEditTarget(null); }}
        initial={
          editTarget
            ? {
              name: editTarget.name,
              minutes: String(editTarget.minutes),
              price_cents: String(editTarget.price_cents),
              currency: editTarget.currency,
              is_active: editTarget.is_active,
            }
            : emptyForm
        }
        onSubmit={(form) => editMutation.mutate(form)}
        loading={editMutation.isPending}
        mode="edit"
      />

    </>
  )
}
