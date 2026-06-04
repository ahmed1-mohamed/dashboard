"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Upload, Info, Download, FileSpreadsheet } from "lucide-react";
import { toast } from "sonner";
import {
  PropertiesTemplate,
  PropertiesFilledTemplate,
} from "@/lib/handle-export";

interface BulkImportProjectsModalProps {
  isOpen: boolean;
  projectId?: number;
  projectName?: string;
  onClose: () => void;
  projects?: unknown[];
}

export function BulkImportProjectsModal({
  isOpen,
  projectId,
  projectName,
  onClose,
}: BulkImportProjectsModalProps) {
  const router = useRouter();
  const { data: session } = useSession();
  const token = session?.user.accessToken;

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploaded, setIsUploaded] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isChecked2, setIsChecked2] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setSelectedFile(null);
      setIsUploaded(false);
      setIsUploading(false);
      setIsChecked(false);
      setIsChecked2(false);
    }
  }, [isOpen]);

  const isValidFile = (file: File) => {
    const validExtensions = [".xlsx", ".xls", ".csv"];
    return validExtensions.some((ext) => file.name.endsWith(ext));
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setIsUploaded(false);
    } else {
      toast.error("Please upload a valid Excel (.xlsx), (.xls) or (.csv) file.");
    }
  };

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files?.[0];
    if (file && isValidFile(file)) {
      setSelectedFile(file);
      setIsUploaded(false);
    } else {
      toast.error("Please upload a valid Excel (.xlsx), (.xls) or (.csv) file.");
    }
  };

  const prepareFormData = () => {
    if (!selectedFile) return null;
    const formData = new FormData();
    formData.append("file", selectedFile);
    if (projectId != null) formData.append("project_id", String(projectId));
    formData.append("replace", isChecked ? "true" : "false");
    formData.append("remove", isChecked2 ? "true" : "false");
    return formData;
  };

  const handleUpload = async () => {
    if (!selectedFile) { toast.error("Please select a file first"); return; }
    if (projectId == null || projectId === 0) { toast.error("Project ID is not valid"); return; }

    const formData = prepareFormData();
    if (!formData) { toast.error("No file selected"); return; }

    setIsUploading(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL_IMPORTS;
      const response = await fetch(`${apiUrl}/dashboard/import/properties`, {
        method: "POST",
        body: formData,
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });

      const result = await response.json();

      localStorage.setItem("projectName", JSON.stringify({ projectName }));
      localStorage.setItem("report", JSON.stringify({
        success: result.success,
        message: result.message,
        data: result.data,
      }));

      if (response.ok) {
        toast.success("File uploaded successfully!");
        setIsUploaded(true);
      } else {
        toast.error(`Upload error: ${result.message || "Something went wrong"}`);
        setIsUploaded(false);
      }

      router.push("/admin/reports");
    } catch (error) {
      toast.error(`Upload error: ${error instanceof Error ? error.message : "Network error"}`);
      setIsUploaded(false);
    } finally {
      setIsUploading(false);
    }
  };

  const downloadTemplate = () => {
    setIsDownloading(true);
    PropertiesTemplate();
    toast.success("Template downloaded successfully!");
    setIsDownloading(false);
  };

  const downloadFilledFile = async () => {
    if (projectId == null || projectId === 0) { toast.error("Project ID is not valid"); return; }
    setIsDownloading(true);
    await PropertiesFilledTemplate(projectId, token!);
    setIsDownloading(false);
  };

  const handleClose = () => {
    setSelectedFile(null);
    setIsUploaded(false);
    setIsUploading(false);
    setIsChecked(false);
    setIsChecked2(false);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Bulk Import Properties"
      size="lg"
      showCloseButton={true}
      footer={
        <div className="flex gap-3 justify-end w-full">
          <Button variant="outline" onClick={handleClose}>Close</Button>
          <Button
            className="bg-teal-600 hover:bg-teal-700 text-white"
            onClick={handleUpload}
            disabled={!selectedFile || isUploading || isUploaded}
          >
            {isUploading ? "Uploading..." : "Upload"}
          </Button>
        </div>
      }
    >
      <div className="space-y-6 max-h-[70vh] overflow-y-auto">
        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            Upload an Excel or CSV file containing property data to import them in bulk.
            Make sure your file follows the required template format.
          </p>
        </div>

        {/* Download Templates */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <div className="flex items-start gap-3 mb-4">
            <FileSpreadsheet className="h-5 w-5 text-gray-600 mt-0.5 shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 text-sm mb-2">Download Templates</h3>
              <p className="text-xs text-gray-600 mb-3">
                Download the appropriate template to ensure your data is formatted correctly.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadTemplate}
                  disabled={isDownloading}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Empty Template
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={downloadFilledFile}
                  disabled={isDownloading || !projectId}
                  className="gap-2"
                >
                  <Download className="h-4 w-4" />
                  Template with Data
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 className="font-semibold text-gray-900 text-sm mb-3">Options</h3>
          <div className="space-y-3">
            <div className="flex items-center space-x-3">
              <Checkbox
                id="replace"
                checked={isChecked}
                onCheckedChange={(checked) => setIsChecked(checked as boolean)}
              />
              <Label htmlFor="replace" className="text-sm text-gray-700 cursor-pointer">
                Replace existing data
              </Label>
            </div>
            <div className="flex items-center space-x-3">
              <Checkbox
                id="remove"
                checked={isChecked2}
                onCheckedChange={(checked) => setIsChecked2(checked as boolean)}
              />
              <Label htmlFor="remove" className="text-sm text-gray-700 cursor-pointer">
                Remove non-existing data
              </Label>
            </div>
          </div>
        </div>

        {/* Upload File */}
        <div>
          <div className="flex items-center gap-1 mb-2">
            <Label>Upload file <span className="text-red-500">*</span></Label>
            <Info className="h-3 w-3 text-gray-400" />
          </div>

          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors cursor-pointer ${isDragging
                ? "border-teal-500 bg-teal-50"
                : selectedFile
                  ? "border-green-500 bg-green-50"
                  : "border-gray-300 bg-gray-50"
              }`}
            onClick={() => document.getElementById("proj-file-upload")?.click()}
          >
            <label htmlFor="proj-file-upload" className="cursor-pointer">
              <span className="sr-only">Upload CSV or Excel file</span>
              <input
                id="proj-file-upload"
                type="file"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
                className="hidden"
              />
            </label>

            <div className="flex flex-col items-center gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center ${selectedFile ? "bg-green-100" : "bg-gray-200"}`}>
                <Upload className={`h-6 w-6 ${selectedFile ? "text-green-600" : "text-gray-600"}`} />
              </div>
              <div>
                {selectedFile ? (
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                    <p className="text-xs text-gray-500">{(selectedFile.size / 1024).toFixed(2)} KB</p>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-gray-600 mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500">Supported formats: CSV, Excel (.xlsx, .xls)</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {selectedFile && (
            <div className="flex items-center justify-between mt-3 p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                <FileSpreadsheet className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-700">{selectedFile.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                className="text-red-600 hover:text-red-700"
              >
                Remove
              </Button>
            </div>
          )}
        </div>

        {/* Uploading */}
        {isUploading && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-800">Uploading file...</p>
                <p className="text-xs text-blue-600">Please wait while your file is being processed</p>
              </div>
            </div>
          </div>
        )}

        {/* Success */}
        {isUploaded && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center gap-3">
              <div className="h-5 w-5 rounded-full bg-green-600 flex items-center justify-center">
                <svg className="h-3 w-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-green-800">File uploaded successfully!</p>
                <p className="text-xs text-green-600">Redirecting to reports page...</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
