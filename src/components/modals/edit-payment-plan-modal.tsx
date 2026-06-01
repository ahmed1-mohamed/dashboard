"use client";

import { useState, useEffect } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Minus, Loader2, Check } from "lucide-react";
import { useEditPaymentPlanData } from "@/hooks/use-edit-payment-plan";
import { usePaymentPlanActions } from "@/hooks/use-payment-plan-actions";
import { usePaymentPlanItemActions } from "@/hooks/use-payment-plan-item-actions";
import { toast } from "sonner";

interface PaymentPlanItem {
  id?: number;
  payment_plan_item_id?: number;
  type: string;
  percentage: string | number;
  intervals?: number;
}

interface PaymentPlan {
  payment_plan_id: number;
  name: string;
  description?: string | null;
  payment_plan_type?: string;
  period_by_years?: number | null;
  total_cost?: string;
  status?: string;
  type?: string;
  paymentplanitems?: PaymentPlanItem[];
}

interface EditPaymentPlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  paymentPlan: PaymentPlan | null;
  projectId: number;
  developerId: number;
}

interface TypeRow {
  type_key: string;
  value: string;
  intervals: string;
  id?: number;
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

export function EditPaymentPlanModal({
  isOpen,
  onClose,
  paymentPlan,
  projectId,
  developerId,
}: EditPaymentPlanModalProps) {
  // const paymentId = paymentPlan?.payment_plan_id;

  // // Fetch existing payment plan details
  // const { data: paymentData, isLoading } = useEditPaymentPlanData(
  //   paymentId,
  //   isOpen,
  // );

  // // Step state: 1 = edit plan, 2 = edit items
  // const [step, setStep] = useState(1);

  // // Local state for step 1
  // const [name, setName] = useState("");
  // const [description, setDescription] = useState("");
  // const [period, setPeriod] = useState(0);

  // // Store selected types as string keys
  // const [selectedTypeKeys, setSelectedTypeKeys] = useState<string[]>([]);

  // // React Hook Form for step 2
  // const {
  //   register,
  //   reset: resetRHF,
  //   getValues,
  //   control,
  // } = useForm<{ types: TypeRow[] }>({
  //   defaultValues: { types: [] },
  // });

  // const { fields, append, remove } = useFieldArray({
  //   control,
  //   name: "types",
  // });

  // // Sync fetched data into the form when modal opens
  // useEffect(() => {
  //   if (paymentData && isOpen) {
  //     setName(paymentData.name || "");
  //     setDescription(paymentData.description || "");
  //     setPeriod(paymentData.period_by_years || 0);

  //     // Initialize selected types from existing items
  //     const existingItems = paymentData.paymentplanitems || [];
  //     const keys = existingItems.map((t: PaymentPlanItem) => t.type);
  //     setSelectedTypeKeys(keys);

  //     // Initialize RHF with existing types
  // const initialTypes: TypeRow[] = keys.map((key: string, index) => {
  //       const item = existingItems[index];
  //       return {
  //         type_key: key,
  //         value: item?.percentage?.toString() || "",
  //         intervals: item?.intervals?.toString() || "",
  //         id: item?.id,
  //       };
  //     });
  //     resetRHF({ types: initialTypes });
  //   }
  // }, [paymentData, isOpen, resetRHF]);

  // // Watch selected type keys
  // const watchedTypes = getValues("types");

  // const handleTypeSelection = (value: string) => {
  //   if (!selectedTypeKeys.includes(value)) {
  //     const newKeys = [...selectedTypeKeys, value];
  //     setSelectedTypeKeys(newKeys);
  //     // Add to field array
  //     append({ type_key: value, value: "", intervals: "" });
  //   }
  // };

  // const handleRemoveType = (index: number, typeKey: string) => {
  //   remove(index);
  //   setSelectedTypeKeys(selectedTypeKeys.filter((k) => k !== typeKey));
  // };

  // const { updatePaymentPlan, isUpdating } = usePaymentPlanActions();
  // const { updatePaymentPlanItems, isUpdatingItems } =
  //   usePaymentPlanItemActions();

  // // Initialize form with existing data
  // useEffect(() => {
  //   if (paymentData) {
  //     setName(paymentData.name || "");
  //     setDescription(paymentData.description || "");
  //     setPeriod(paymentData.period_by_years || 0);
  //     setSelectedTypeKeys([]);
  //   }
  // }, [paymentData]);

  // const handleUpdatePlan = async (e: React.FormEvent) => {
  //   e.preventDefault();
  //   if (!name.trim()) {
  //     toast.error("Name is required");
  //     return;
  //   }

  //   const payload = {
  //     name: name.trim(),
  //     description: description.trim(),
  //     period_by_years: period,
  //     status: "active",
  //     developerId,
  //   };

  //   await updatePaymentPlan({
  //     projectId,
  //     paymentId: paymentId!,
  //     data: payload,
  //   });
  //   setStep(2);
  // };

  // const handleUpdateItems = async () => {
  //   const { types } = getValues();
  //   if (!types || types.length === 0) {
  //     toast.error("Please select at least one type.");
  //     return;
  //   }

  //   await updatePaymentPlanItems(types);
  // };

  // const handleClose = () => {
  //   // Reset all state
  //   setStep(1);
  //   setName("");
  //   setDescription("");
  //   setPeriod(0);
  //   setSelectedTypeKeys([]);
  //   resetRHF({ types: [] });
  //   onClose();
  // };

  // if (!paymentPlan) return null;

  // if (isLoading && step === 1) {
  //   return (
  //     <Modal
  //       isOpen={isOpen}
  //       onClose={handleClose}
  //       title="Edit Payment Plan"
  //       size="lg"
  //       showCloseButton={false}
  //     >
  //       <div className="flex justify-center py-8">
  //         <Loader2 className="h-6 w-6 animate-spin text-teal-600" />
  //       </div>
  //     </Modal>
  //   );
  // }

  // return (
  //   <Modal
  //     isOpen={isOpen}
  //     onClose={handleClose}
  //     title={step === 1 ? "Edit Payment Plan" : "Edit Payment Plan Items"}
  //     size="lg"
  //     showCloseButton={false}
  //   >
  //     {step === 1 ? (
  //       // Step 1: Edit Payment Plan
  //       <form onSubmit={handleUpdatePlan} className="space-y-4">
  //         <div>
  //           <Label>
  //             Plan Name <span className="text-red-500">*</span>
  //           </Label>
  //           <Input
  //             placeholder="e.g. 30/70 Payment Plan"
  //             value={name}
  //             onChange={(e) => setName(e.target.value)}
  //             className="mt-1"
  //           />
  //         </div>

  //         <div>
  //           <Label>Description</Label>
  //           <Textarea
  //             placeholder="Write description here"
  //             value={description}
  //             onChange={(e) => setDescription(e.target.value)}
  //             className="mt-1"
  //           />
  //         </div>

  //         <div>
  //           <Label>Period (Years)</Label>
  //           <Input
  //             type="number"
  //             placeholder="e.g. 5"
  //             value={period}
  //             onChange={(e) => setPeriod(Number(e.target.value))}
  //             className="mt-1"
  //           />
  //         </div>

  //         <div>
  //           <Label>Payment Types</Label>
  //           <Select onValueChange={handleTypeSelection}>
  //             <SelectTrigger className="mt-1">
  //               <SelectValue placeholder="Select payment types" />
  //             </SelectTrigger>
  //             <SelectContent>
  //               {typeOptions.map((option) => (
  //                 <SelectItem key={option.value} value={option.value}>
  //                   {option.label}
  //                 </SelectItem>
  //               ))}
  //             </SelectContent>
  //           </Select>

  //           {/* Selected types display */}
  //           {selectedTypeKeys.length > 0 && (
  //             <div className="mt-3 space-y-2">
  //               {selectedTypeKeys.map((key, index) => (
  //                 <div
  //                   key={key}
  //                   className="flex items-center justify-between bg-gray-50 p-2 rounded"
  //                 >
  //                   <span className="text-sm">{key}</span>
  //                   <Button
  //                     type="button"
  //                     variant="ghost"
  //                     size="sm"
  //                     onClick={() => handleRemoveType(index, key)}
  //                   >
  //                     <Minus className="h-4 w-4 text-red-500" />
  //                   </Button>
  //                 </div>
  //               ))}
  //             </div>
  //           )}
  //         </div>

  //         <div className="flex justify-end gap-3 pt-4 border-t">
  //           <Button type="button" variant="outline" onClick={handleClose}>
  //             Cancel
  //           </Button>
  //           <Button
  //             type="submit"
  //             className="bg-teal-600 hover:bg-teal-700 text-white"
  //             disabled={isUpdating || !name.trim()}
  //           >
  //             {isUpdating ? (
  //               <>
  //                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  //                 Updating...
  //               </>
  //             ) : (
  //               <>
  //                 <Check className="w-4 h-4 mr-2" />
  //                 Update Plan
  //               </>
  //             )}
  //           </Button>
  //         </div>
  //       </form>
  //     ) : (
  //       // Step 2: Edit Payment Plan Items
  //       <div className="space-y-4">
  //         <div className="bg-teal-50 p-3 rounded-lg">
  //           <p className="text-sm text-teal-800">
  //             Payment plan '<strong>{name}</strong>' updated successfully! Now
  //             edit the payment items.
  //           </p>
  //         </div>

  //         <div className="space-y-3">
  //           {fields.map((field, index) => (
  //             <div key={field.id} className="flex items-center gap-2">
  //               <div className="flex-1 bg-gray-50 p-2 rounded">
  //                 <span className="text-sm font-medium">
  //                   {selectedTypeKeys[index]}
  //                 </span>
  //                 {field.id && (
  //                   <span className="text-xs text-gray-500 ml-2">
  //                     (existing)
  //                   </span>
  //                 )}
  //               </div>

  //               <Input
  //                 placeholder="Percentage %"
  //                 type="number"
  //                 {...register(`types.${index}.value`)}
  //                 className="w-32"
  //               />

  //               <Input
  //                 placeholder="Intervals"
  //                 type="number"
  //                 {...register(`types.${index}.intervals`)}
  //                 className="w-32"
  //               />
  //             </div>
  //           ))}
  //         </div>

  //         <div className="flex justify-end gap-3 pt-4 border-t">
  //           <Button
  //             type="button"
  //             variant="outline"
  //             onClick={() => setStep(1)}
  //             disabled={isUpdatingItems}
  //           >
  //             Back
  //           </Button>
  //           <Button
  //             type="button"
  //             className="bg-teal-600 hover:bg-teal-700 text-white"
  //             onClick={handleUpdateItems}
  //             disabled={isUpdatingItems}
  //           >
  //             {isUpdatingItems ? (
  //               <>
  //                 <Loader2 className="w-4 h-4 mr-2 animate-spin" />
  //                 Saving...
  //               </>
  //             ) : (
  //               <>
  //                 <Check className="w-4 h-4 mr-2" />
  //                 Save Items
  //               </>
  //             )}
  //           </Button>
  //         </div>
  //       </div>
  //     )}
  //   </Modal>
  // );
}
