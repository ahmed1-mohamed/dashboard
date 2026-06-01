"use client";

import { useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Check, Minus } from "lucide-react";
import { addProjectPayment, addPaymentPlanItem } from "@/data/api-client";
import { toast } from "sonner";

interface AddPaymentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: number;
  developerId: number;
  status?: string;
}

interface TypeRow {
  type_key: string;
  value: string;
  intervals: string;
}

const typeOptions = [
  { value: "Booking", label: "Booking" },
  { value: "Reservation", label: "Reservation" },
  { value: "Down payment", label: "Down payment" },
  { value: "Monthly installment", label: "Monthly installment" },
  { value: "Yearly installment", label: "Yearly installment" },
  { value: "Quarterly installment", label: "Quarterly installment" },
  { value: "Half year installment", label: "Half year installment" },
  { value: "Maintenance yearly fees", label: "Maintenance yearly fees" },
  { value: "Maintenance deposit", label: "Maintenance deposit" },
  { value: "Registration fees", label: "Registration fees" },
  { value: "DLD payment", label: "DLD payment" },
  {
    value: "installments before handover",
    label: "installments before handover",
  },
  { value: "Handover installment", label: "Handover installment" },
  {
    value: "installments after handover",
    label: "installments after handover",
  },
  { value: "Handover fees", label: "Handover fees" },
  { value: "Other fees", label: "Other fees" },
];

export function AddPaymentPlanModal({
  isOpen,
  onClose,
  projectId,
  developerId,
  status = "active",
}: AddPaymentPlanModalProps) {
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  // Step state: 1 = create plan, 2 = add items
  const [step, setStep] = useState(1);

  // Local state for step 1
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [period, setPeriod] = useState(0);

  // Store selected types as string keys
  const [selectedTypeKeys, setSelectedTypeKeys] = useState<string[]>([]);

  // Payment plan ID from step 1
  const [paymentPlanId, setPaymentPlanId] = useState<number | null>(null);

  // React Hook Form for step 2
  const {
    register,
    reset: resetRHF,
    getValues,
    control,
  } = useForm<{ types: TypeRow[] }>({
    defaultValues: { types: [] },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "types",
  });

  // Mutation for creating payment plan (step 1)
  const createPlanMutation = useMutation({
    mutationFn: async (data: unknown) =>
      addProjectPayment(
        data as Parameters<typeof addProjectPayment>[0],
        token!,
      ),
    onSuccess: (data) => {
      // const id = data?.data?.payment_plan_id;
      // if (id) {
      //   setPaymentPlanId(id);
      //   setStep(2);
      //   // Initialize RHF with selected types
      //   const initialTypes: TypeRow[] = selectedTypeKeys.map((key) => ({
      //     type_key: key,
      //     value: "",
      //     intervals: "",
      //   }));
      //   resetRHF({ types: initialTypes });
      // }
      queryClient.invalidateQueries({ queryKey: ["projectDetails"] });
    },
    onError: (error: Error) => {
      console.error("Upload error:", error);
      toast.error(error?.message || "Failed to create Payment Plan.");
    },
  });

  // Mutation for creating payment plan items (step 2)
  const createItemsMutation = useMutation({
    mutationFn: async (itemData: Parameters<typeof addPaymentPlanItem>[0]) =>
      addPaymentPlanItem(itemData, token!),
    onSuccess: () => {
      toast.success("Payment plan and all items created successfully!");
      queryClient.invalidateQueries({ queryKey: ["projectDetails"] });
      handleClose();
    },
    onError: (error: Error) => {
      console.error("Error creating items:", error);
      toast.error(error?.message || "Failed to create payment plan items.");
    },
  });

  const handleCreatePlan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name is required");
      return;
    }

    const payload = {
      name: name.trim(),
      description: description.trim(),
      period_by_years: period,
      status: status,
      entity_type: "PROJECTS",
      entities: [{ entity_id: projectId, developer_id: developerId }],
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    createPlanMutation.mutate(payload as unknown as any);
  };

  const handleCreateItems = async () => {
    if (!paymentPlanId) {
      toast.error("Payment plan ID missing.");
      return;
    }

    const { types } = getValues();
    if (!types || types.length === 0) {
      toast.error("Please select at least one type.");
      return;
    }

    try {
      // Post each selected type as a separate item
      const results = await Promise.all(
        types.map(async (row) => {
          try {
            const result = await addPaymentPlanItem(
              {
                payment_plan_id: paymentPlanId!,
                type: row.type_key,
                percentage: Number(row.value) || 0,
                intervals: Number(row.intervals) || 0,
              },
              token!,
            );
            return {
              ok: true,
              status: 200,
              data: result,
            };
          } catch (error) {
            return {
              ok: false,
              status: 500,
              data: error,
            };
          }
        }),
      );

      const anyFail = results.some((r) => !r.ok);
      if (anyFail) {
        console.error("Some item requests failed:", results);
        toast.error("Some payment plan items failed to create.");
      } else {
        toast.success("Payment plan and all items created");
        queryClient.invalidateQueries({ queryKey: ["projectDetails"] });
        handleClose();
      }
    } catch (err) {
      console.error(err);
      toast.error("Error creating payment plan items.");
    }
  };

  const handleClose = () => {
    // Reset all state
    setStep(1);
    setName("");
    setDescription("");
    setPeriod(0);
    setSelectedTypeKeys([]);
    setPaymentPlanId(null);
    resetRHF({ types: [] });
    onClose();
  };

  const handleTypeSelection = (value: string) => {
    if (!selectedTypeKeys.includes(value)) {
      const newKeys = [...selectedTypeKeys, value];
      setSelectedTypeKeys(newKeys);
      // Add to field array
      append({ type_key: value, value: "", intervals: "" });
    }
  };

  const handleRemoveType = (index: number, typeKey: string) => {
    remove(index);
    setSelectedTypeKeys(selectedTypeKeys.filter((k) => k !== typeKey));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={step === 1 ? "Create Payment Plan" : "Add Payment Plan Items"}
      size="lg"
      showCloseButton={false}
    >
      {step === 1 ? (
        // Step 1: Create Payment Plan
        <form onSubmit={handleCreatePlan} className="space-y-4">
          <div>
            <Label>
              Plan Name <span className="text-red-500">*</span>
            </Label>
            <Input
              placeholder="e.g. 30/70 Payment Plan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Description</Label>
            <Textarea
              placeholder="Write description here"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Period (Years)</Label>
            <Input
              type="number"
              placeholder="e.g. 5"
              value={period}
              onChange={(e) => setPeriod(Number(e.target.value))}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Payment Types</Label>
            <Select onValueChange={handleTypeSelection}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Select payment types" />
              </SelectTrigger>
              <SelectContent>
                {typeOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Selected types display */}
            {selectedTypeKeys.length > 0 && (
              <div className="mt-3 space-y-2">
                {selectedTypeKeys.map((key, index) => (
                  <div
                    key={key}
                    className="flex items-center justify-between bg-gray-50 p-2 rounded"
                  >
                    <span className="text-sm">{key}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveType(index, key)}
                    >
                      <Minus className="h-4 w-4 text-red-500" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              disabled={createPlanMutation.isPending || !name.trim()}
            >
              {createPlanMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create Plan
                </>
              )}
            </Button>
          </div>
        </form>
      ) : (
        // Step 2: Add Payment Plan Items
        <div className="space-y-4">
          <div className="bg-teal-50 p-3 rounded-lg">
            <p className="text-sm text-teal-800">
              Payment plan &quot;<strong>{name}</strong>&quot; created
              successfully! Now add the payment items.
            </p>
          </div>

          <div className="space-y-3">
            {fields.map((field, index) => (
              <div key={field.id} className="flex items-center gap-2">
                <div className="flex-1 bg-gray-50 p-2 rounded">
                  <span className="text-sm font-medium">
                    {selectedTypeKeys[index]}
                  </span>
                </div>

                <Input
                  placeholder="Percentage %"
                  type="number"
                  {...register(`types.${index}.value`)}
                  className="w-32"
                />

                <Input
                  placeholder="Intervals"
                  type="number"
                  {...register(`types.${index}.intervals`)}
                  className="w-32"
                />
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => setStep(1)}
              disabled={createItemsMutation.isPending}
            >
              Back
            </Button>
            <Button
              type="button"
              className="bg-teal-600 hover:bg-teal-700 text-white"
              onClick={handleCreateItems}
              disabled={createItemsMutation.isPending}
            >
              {createItemsMutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Save Items
                </>
              )}
            </Button>
          </div>
        </div>
      )}
    </Modal>
  );
}
