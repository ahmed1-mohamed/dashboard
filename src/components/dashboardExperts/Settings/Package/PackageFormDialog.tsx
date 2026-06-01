import { PackageFormData } from "@/types/expertDashboard/package";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function PackageFormDialog({
  open,
  onOpenChange,
  initial,
  onSubmit,
  loading,
  mode,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initial: PackageFormData;
  onSubmit: (data: PackageFormData) => void;
  loading: boolean;
  mode: "add" | "edit";
}) {
  const [form, setForm] = useState<PackageFormData>(initial);
  const [prevInitial, setPrevInitial] = useState(initial);

  if (initial !== prevInitial) {
    setPrevInitial(initial);
    setForm(initial);
  }

  const set = (key: keyof PackageFormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[460px] p-0 gap-0 overflow-hidden rounded-[12px]">
        <DialogHeader className="px-6 py-4 border-b border-[#E5E7EB]">
          <DialogTitle className="text-[16px] font-semibold text-[#15042B]">
            {mode === "add" ? "Add Package" : "Edit Package"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-6 py-5 flex flex-col gap-4">

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#15042B]">Package Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Basic Package"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              className="border border-[#E5E7EB] rounded-[8px] px-3 py-2.5 text-[14px] text-[#15042B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#008081]/30 focus:border-[#008081] transition-all"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#15042B]">Duration (minutes)</label>
            <input
              required
              type="number"
              min="1"
              placeholder="e.g. 30"
              value={form.minutes}
              onChange={(e) => set("minutes", e.target.value)}
              className="border border-[#E5E7EB] rounded-[8px] px-3 py-2.5 text-[14px] text-[#15042B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#008081]/30 focus:border-[#008081] transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#15042B]">Price</label>
              <input
                required
                type="number"
                min="0"
                placeholder="e.g. 25000"
                value={form.price_cents}
                onChange={(e) => set("price_cents", e.target.value)}
                className="border border-[#E5E7EB] rounded-[8px] px-3 py-2.5 text-[14px] text-[#15042B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#008081]/30 focus:border-[#008081] transition-all"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] font-medium text-[#15042B]">Currency</label>
              <input
                type="text"
                placeholder="e.g. USD"
                value={form.currency}
                onChange={(e) => set("currency", e.target.value)}
                className="border border-[#E5E7EB] rounded-[8px] px-3 py-2.5 text-[14px] text-[#15042B] placeholder:text-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#008081]/30 focus:border-[#008081] transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 py-1">
            <button
              type="button"
              onClick={() => set("is_active", !form.is_active)}
              className={`relative w-10 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#008081]/30 ${form.is_active ? "bg-[#008081]" : "bg-[#D1D5DB]"
                }`}
            >
              <span
                className={`absolute top-[3px] left-[3px] w-[18px] h-[18px] bg-white rounded-full shadow-sm transition-transform duration-200 ${form.is_active ? "translate-x-4" : "translate-x-0"
                  }`}
              />
            </button>
            <span className="text-[13px] font-medium text-[#15042B]">Active</span>
          </div>

          <DialogFooter className="flex justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-[8px] text-[14px] font-medium text-[#374151] border border-[#E5E7EB] hover:bg-[#F9FAFB] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 rounded-[8px] text-[14px] font-medium text-white bg-[#008081] hover:bg-[#006e6e] transition-colors disabled:opacity-60 disabled:cursor-not-allowed min-w-[100px] flex items-center justify-center"
            >
              {loading ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : mode === "add" ? (
                "Add Package"
              ) : (
                "Save Changes"
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

