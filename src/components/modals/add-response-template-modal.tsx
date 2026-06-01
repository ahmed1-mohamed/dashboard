"use client";

import { useState } from "react";
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

interface AddResponseTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ResponseTemplateFormData) => void;
}

export interface ResponseTemplateFormData {
  category: string;
  triggerKeywords: string;
  responseTemplate: string;
}

const categories = [
  "Property Search",
  "Pricing Inquiry",
  "Location Information",
  "Booking Request",
  "General Support",
  "Technical Issue",
];

export function AddResponseTemplateModal({
  isOpen,
  onClose,
  onSubmit,
}: AddResponseTemplateModalProps) {
  const [formData, setFormData] = useState<ResponseTemplateFormData>({
    category: "",
    triggerKeywords: "",
    responseTemplate: "",
  });

  const handleSubmit = () => {
    onSubmit(formData);
    // Reset form
    setFormData({
      category: "",
      triggerKeywords: "",
      responseTemplate: "",
    });
    onClose();
  };

  const handleClose = () => {
    // Reset form on close
    setFormData({
      category: "",
      triggerKeywords: "",
      responseTemplate: "",
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Add Response Template"
      size="md"
      showCloseButton={false}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={handleClose}>
            Close
          </Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleSubmit}
          >
            Add Template
          </Button>
        </div>
      }
    >
      <div className="space-y-5">
        {/* Category */}
        <div>
          <Label htmlFor="category">
            Category <span className="text-red-500">*</span>
          </Label>
          <Select
            value={formData.category}
            onValueChange={(value) =>
              setFormData({ ...formData, category: value })
            }
          >
            <SelectTrigger className="mt-1">
              <SelectValue placeholder="Select Category" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Trigger Keywords */}
        <div>
          <Label htmlFor="trigger-keywords">
            Trigger Keywords <span className="text-red-500">*</span>
          </Label>
          <Input
            id="trigger-keywords"
            placeholder="e.g. Looking For Apartment"
            value={formData.triggerKeywords}
            onChange={(e) =>
              setFormData({ ...formData, triggerKeywords: e.target.value })
            }
            className="mt-1"
          />
          <p className="text-xs text-gray-500 mt-1">
            Separate multiple keywords with commas
          </p>
        </div>

        {/* Response Template */}
        <div>
          <Label htmlFor="response-template">
            Response Template <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="response-template"
            placeholder="Write description here"
            value={formData.responseTemplate}
            onChange={(e) =>
              setFormData({ ...formData, responseTemplate: e.target.value })
            }
            className="mt-1 min-h-[120px]"
          />
          <p className="text-xs text-gray-500 mt-1">
            You can use variables like [property_name], [price], [location]
          </p>
        </div>
      </div>
    </Modal>
  );
}
