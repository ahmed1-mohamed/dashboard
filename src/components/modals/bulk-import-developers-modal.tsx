"use client";

import { useState } from "react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Upload, Info, Search } from "lucide-react";

interface BulkImportDevelopersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (file: File) => void;
}

export function BulkImportDevelopersModal({
  isOpen,
  onClose,
  onSubmit,
}: BulkImportDevelopersModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmit = () => {
    if (selectedFile) {
      onSubmit(selectedFile);
      setSelectedFile(null);
      onClose();
    }
  };

  const handleClose = () => {
    setSelectedFile(null);
    onClose();
  };

  const handleDownloadTemplate = (withData: boolean) => {
    console.log(`Downloading template ${withData ? "with data" : "empty"}`);
    // Here you would trigger actual file download
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bulk Import Developers"
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
            disabled={!selectedFile}
          >
            Upload Developers
          </Button>
        </div>
      }
    >
      <div className="space-y-5 max-h-[70vh] overflow-y-auto">
        {/* Description */}
        <p className="text-sm text-gray-600">
          Upload Excel or CSV file containing developer data to add them in bulk
        </p>

        {/* Download Template Section */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start gap-2 mb-3">
            <Info className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
            <div>
              <h3 className="font-semibold text-gray-900 text-sm mb-1">
                Download the appropriate template
              </h3>
              <p className="text-xs text-gray-600">
                Required columns: Developer Name, Country, Email, Phone,
                Website, Address
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="bg-gray-800 text-white hover:bg-gray-900 hover:text-white text-sm"
              onClick={() => handleDownloadTemplate(false)}
            >
              Empty Template
            </Button>
            <Button
              variant="outline"
              className="bg-gray-700 text-white hover:bg-gray-800 hover:text-white text-sm"
              onClick={() => handleDownloadTemplate(true)}
            >
              Template with Data
            </Button>
          </div>
        </div>

        {/* Upload File Section */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Label>
              Upload file <span className="text-red-500">*</span>
            </Label>
            <Info className="h-3 w-3 text-gray-400" />
          </div>

          {/* Drag and Drop Area */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              isDragging
                ? "border-teal-500 bg-teal-50"
                : "border-gray-300 bg-gray-50"
            }`}
          >
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <Upload className="h-6 w-6 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600 mb-1">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to upload or drag and drop"}
                </p>
                <p className="text-xs text-gray-500">Max. File Size: 30MB</p>
              </div>
              <Button
                className="bg-teal-600 hover:bg-teal-700 text-white gap-2"
                onClick={() => document.getElementById("file-upload")?.click()}
              >
                <Search className="h-4 w-4" />
                Browse file
              </Button>
            <label htmlFor="file-upload" className="cursor-pointer">
  <input
    id="file-upload"
    type="file"
    accept=".csv,.xlsx,.xls"
    onChange={handleFileSelect}
    className="hidden"
  />
  <span>Upload file</span>
</label>
            </div>
          </div>

          <p className="text-xs text-gray-500 mt-2">
            Supported formats: CSV, Excel (.xlsx, .xls)
          </p>
        </div>
      </div>
    </Modal>
  );
}
