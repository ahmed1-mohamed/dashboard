"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Modal, ConfirmModal } from "@/components/ui/modal";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

/**
 * Example component demonstrating modal usage
 * This can be used as a reference for implementing modals in your pages
 */
export function ModalExamples() {
  const [basicModalOpen, setBasicModalOpen] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [formModalOpen, setFormModalOpen] = useState(false);
  const [largeModalOpen, setLargeModalOpen] = useState(false);

  const handleConfirm = () => {
    console.log("Confirmed!");
    setConfirmModalOpen(false);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submitted!");
    setFormModalOpen(false);
  };

  return (
    <div className="space-y-4 p-6">
      <h2 className="text-2xl font-bold">Modal Examples</h2>
      <div className="flex flex-wrap gap-4">
        {/* Basic Modal */}
        <Button onClick={() => setBasicModalOpen(true)}>
          Open Basic Modal
        </Button>
        <Modal
          isOpen={basicModalOpen}
          onClose={() => setBasicModalOpen(false)}
          title="Basic Modal"
          description="This is a basic modal example"
        >
          <p className="text-gray-600">
            This is the content of the modal. You can put any content here.
          </p>
        </Modal>

        {/* Confirm Modal */}
        <Button onClick={() => setConfirmModalOpen(true)} variant="destructive">
          Open Confirm Modal
        </Button>
        <ConfirmModal
          isOpen={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleConfirm}
          title="Delete Item"
          description="Are you sure you want to delete this item? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          variant="destructive"
        />

        {/* Form Modal */}
        <Button onClick={() => setFormModalOpen(true)}>Open Form Modal</Button>
        <Modal
          isOpen={formModalOpen}
          onClose={() => setFormModalOpen(false)}
          title="Add New Item"
          description="Fill in the details below"
          footer={
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setFormModalOpen(false)}>
                Cancel
              </Button>
              <Button
                className="bg-teal-600 hover:bg-teal-700"
                onClick={handleFormSubmit}
              >
                Submit
              </Button>
            </div>
          }
        >
          <form onSubmit={handleFormSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" placeholder="Enter name" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter description"
                rows={4}
              />
            </div>
          </form>
        </Modal>

        {/* Large Modal */}
        <Button onClick={() => setLargeModalOpen(true)}>
          Open Large Modal
        </Button>
        <Modal
          isOpen={largeModalOpen}
          onClose={() => setLargeModalOpen(false)}
          title="Large Modal"
          description="This is a large modal with more content"
          size="xl"
        >
          <div className="space-y-4">
            <p className="text-gray-600">
              This modal has more space for content. You can use it for complex
              forms or detailed information.
            </p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="field1">Field 1</Label>
                <Input id="field1" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field2">Field 2</Label>
                <Input id="field2" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field3">Field 3</Label>
                <Input id="field3" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="field4">Field 4</Label>
                <Input id="field4" />
              </div>
            </div>
          </div>
        </Modal>
      </div>

      {/* Usage Instructions */}
      <div className="mt-8 p-6 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-4">How to Use Modals</h3>
        <div className="space-y-4 text-sm text-gray-700">
          <div>
            <h4 className="font-medium mb-2">1. Basic Modal:</h4>
            <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
              {`import { Modal } from "@/components/ui/modal";

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  description="Optional description"
>
  Your content here
</Modal>`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">2. Confirm Modal:</h4>
            <pre className="bg-white p-3 rounded text-xs overflow-x-auto">
              {`import { ConfirmModal } from "@/components/ui/modal";

<ConfirmModal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  onConfirm={handleConfirm}
  title="Confirm Action"
  description="Are you sure?"
  confirmText="Yes"
  cancelText="No"
  variant="destructive"
/>`}
            </pre>
          </div>

          <div>
            <h4 className="font-medium mb-2">3. Available Sizes:</h4>
            <p className="text-gray-600">sm, md, lg (default), xl, full</p>
          </div>
        </div>
      </div>
    </div>
  );
}
