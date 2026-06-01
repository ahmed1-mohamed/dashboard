"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import useBookingDetails from "@/hooks/use-booking-details";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  XCircle,
  ChevronRight,
  ChevronLeft,
  Printer,
  FileText,
  Download,
  File,
  Upload,
} from "lucide-react";

export default function BookingDetailsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const params = useParams();
  const token = session?.user?.accessToken as string;
  const reservationId = Number(params?.id);

  const [salesOfferFile, setSalesOfferFile] = useState<File | null>(null);
  const [spaFile, setSpaFile] = useState<File | null>(null);
  const [adminComment, setAdminComment] = useState("");
  const [activeTab, setActiveTab] = useState<
    "details" | "upload" | "Bank" | "SPA"
  >("details");

  // Use custom hook for booking details
  const {
    bookingData,
    isLoading,
    isError,
    error,
    refetch,
    approveMutation,
    declineMutation,
    uploadSalesOfferMutation,
    uploadSPAMutation,
    formatPrice,
    stages,
    getStatusIcon,
    getStatusBadge,
  } = useBookingDetails({ reservationId });

  const handleSalesOfferUpload = () => {
    if (!salesOfferFile) return;
    uploadSalesOfferMutation.mutate({
      file: salesOfferFile,
      comments: adminComment,
    });
  };

  const handleSpaUpload = () => {
    if (!spaFile) return;
    uploadSPAMutation.mutate({
      file: spaFile,
      comments: adminComment,
    });
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch file");
      }

      const blob = await response.blob();
      const contentType = blob.type;
      let ext = "";
      if (
        contentType.includes("image/jpeg") ||
        contentType.includes("image/jpg")
      )
        ext = ".jpg";
      else if (contentType.includes("image/png")) ext = ".png";
      else if (contentType.includes("image/gif")) ext = ".gif";
      else if (contentType.includes("application/pdf")) ext = ".pdf";
      else if (contentType.includes("application/msword")) ext = ".doc";
      else if (
        contentType.includes(
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        )
      )
        ext = ".docx";

      const finalFilename = filename + ext;
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = finalFilename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Download failed:", error);
      window.open(url, "_blank");
    }
  };

  // Tab logic based on reservation status
  useEffect(() => {
    if (!bookingData) return;

    const { reservation_status_type, reservation_status } =
      bookingData.reservation;

    if (
      reservation_status_type == "Identification" &&
      (reservation_status == "in Process" || reservation_status == "cancelled")
    ) {
      setActiveTab("details");
    } else {
      if (
        reservation_status_type == "Identification" &&
        reservation_status == "confirmed"
      ) {
        setActiveTab("details");
      } else {
        if (
          reservation_status_type == "Identification" &&
          (reservation_status == "in Process" ||
            reservation_status == "cancelled")
        ) {
          setActiveTab("upload");
        } else {
          if (
            reservation_status_type == "Sales Offer" &&
            reservation_status == "confirmed"
          ) {
            setActiveTab("Bank");
          } else {
            if (
              reservation_status_type == "Down payment" &&
              (reservation_status == "in Process" ||
                reservation_status == "cancelled")
            ) {
              setActiveTab("Bank");
            } else {
              if (
                reservation_status_type == "Down payment" &&
                reservation_status == "confirmed"
              ) {
                setActiveTab("SPA");
              } else {
                if (
                  reservation_status_type == "Sales Purchase" &&
                  (reservation_status == "in Process" ||
                    reservation_status == "cancelled")
                ) {
                  setActiveTab("SPA");
                } else {
                  if (
                    reservation_status_type == "Sales Purchase" &&
                    reservation_status == "confirmed"
                  ) {
                    setActiveTab("SPA");
                  }
                }
              }
            }
          }
        }
      }
    }
  }, [bookingData]);

  const { reservation, user, paymentPlan, country, property } =
    bookingData || {};

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-teal-600" />
          <p className="mt-4 text-gray-600">Loading booking details...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (isError || !bookingData) {
    return (
      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="max-w-md text-center">
          <XCircle className="mx-auto h-12 w-12 text-red-600" />
          <h2 className="mt-4 text-xl font-semibold text-gray-900">
            Error Loading Booking
          </h2>
          {/* <p className="mt-2 text-gray-600">
            {error?.message || "Booking not found"}
          </p> */}
          <Button
            onClick={() => router.push("/admin/bookings")}
            className="mt-6 bg-teal-600 hover:bg-teal-700"
          >
            Back to Bookings
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 px-3 space-y-4 max-w-full overflow-hidden">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <span>Home</span>
        <ChevronRight className="h-4 w-4" />
        <span>Bookings</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-gray-900">
          Booking #{bookingData.reservation.reservation_id}
        </span>
      </div>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/bookings")}
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Booking Details</h1>
        </div>
        <Button className="bg-teal-600 hover:bg-teal-700 text-white gap-2">
          <Printer className="h-4 w-4" />
          Print Invoice
        </Button>
      </div>

      {/* Status Pills */}
      <div className="grid grid-cols-4 gap-4">
        {stages.map((stage: any) => (
          <div
            key={stage.id}
            className="bg-white rounded-lg border border-gray-200 p-4 flex items-center gap-3"
          >
            {getStatusIcon(stage.status)}
            <div>
              <p className="text-sm font-semibold text-gray-900">
                {stage.name}
              </p>
              {getStatusBadge(stage.status)}
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side - Stages */}
        <div className="lg:col-span-2 space-y-4">
          {stages.map((stage: any) => (
            <div
              key={stage.id}
              className="bg-white rounded-lg border border-gray-200 overflow-hidden"
            >
              {/* Stage Header */}
              <div className="bg-teal-50 border-b border-gray-200 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-teal-600 text-white flex items-center justify-center font-semibold">
                    {stage.id}
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Stage {stage.id}: {stage.name}
                    </h3>
                    <p className="text-sm text-gray-600">{stage.step}</p>
                  </div>
                </div>
                {getStatusBadge(stage.status)}
              </div>

              {/* Stage Content */}
              <div className="p-5 space-y-4">
                {/* Documents */}
                {(stage.documents && stage.documents.length > 0) ||
                stage.name === "Sales Offer" ||
                stage.name === "SPA" ||
                stage.name === "Down Payment" ? (
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900 mb-3">
                      Documents{" "}
                      {stage.documents && `(${stage.documents.length})`}
                    </h4>
                    <div className="space-y-2">
                      {stage.documents &&
                        stage.documents.map((doc: any, idx: any) => (
                          <div
                            key={idx}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                                <FileText className="h-5 w-5 text-teal-600" />
                              </div>
                              <span className="text-sm font-medium text-gray-900">
                                {doc.name}
                              </span>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="gap-2"
                              onClick={() => handleDownload(doc.url, doc.name)}
                            >
                              <Download className="h-4 w-4" />
                              Download
                            </Button>
                          </div>
                        ))}

                      {/* Upload Button for Sales Offer */}
                      {stage.name === "Sales Offer" && (
                        <div className="mt-4">
                          <input
                            type="file"
                            id="salesOfferUpload"
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setSalesOfferFile(file);
                              }
                            }}
                          />
                          <label
                            htmlFor="salesOfferUpload"
                            className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors"
                          >
                            {salesOfferFile ? (
                              <>
                                <File className="h-5 w-5 text-teal-600" />
                                <span className="text-sm font-medium text-teal-600">
                                  {salesOfferFile.name}
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="h-5 w-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-500">
                                  Upload Photo or Document
                                </span>
                              </>
                            )}
                          </label>
                          {salesOfferFile && (
                            <Button
                              className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white"
                              onClick={handleSalesOfferUpload}
                              disabled={uploadSalesOfferMutation.isPending}
                            >
                              {uploadSalesOfferMutation.isPending ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload Sales Offer
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      )}

                      {/* Upload Button for SPA */}
                      {stage.name === "SPA" && (
                        <div className="mt-4">
                          <input
                            type="file"
                            id="spaUpload"
                            className="hidden"
                            accept="image/*,.pdf,.doc,.docx"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setSpaFile(file);
                              }
                            }}
                          />
                          <label
                            htmlFor="spaUpload"
                            className="flex items-center justify-center gap-2 p-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-teal-500 hover:bg-teal-50 transition-colors"
                          >
                            {spaFile ? (
                              <>
                                <File className="h-5 w-5 text-teal-600" />
                                <span className="text-sm font-medium text-teal-600">
                                  {spaFile.name}
                                </span>
                              </>
                            ) : (
                              <>
                                <Upload className="h-5 w-5 text-gray-400" />
                                <span className="text-sm font-medium text-gray-500">
                                  Upload Photo or Document
                                </span>
                              </>
                            )}
                          </label>
                          {spaFile && (
                            <Button
                              className="w-full mt-2 bg-teal-600 hover:bg-teal-700 text-white"
                              onClick={handleSpaUpload}
                              disabled={uploadSPAMutation.isPending}
                            >
                              {uploadSPAMutation.isPending ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Uploading...
                                </>
                              ) : (
                                <>
                                  <Upload className="h-4 w-4 mr-2" />
                                  Upload SPA
                                </>
                              )}
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}

                {/* Action Buttons */}
                {stage.status === "Pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      className="flex-1 bg-teal-600 hover:bg-teal-700 text-white"
                      disabled={approveMutation.isPending}
                      onClick={() => {
                        approveMutation.mutate(adminComment);
                      }}
                    >
                      {approveMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Approve"
                      )}
                    </Button>
                    <Button
                      className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                      disabled={declineMutation.isPending}
                      onClick={() => {
                        declineMutation.mutate(adminComment);
                      }}
                    >
                      {declineMutation.isPending ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        "Reject"
                      )}
                    </Button>
                    <Button variant="outline" className="px-4">
                      Reply
                    </Button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Right Side - Info Cards */}
        <div className="space-y-6">
          {/* Client Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Client Information
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Client Name</span>
                <span className="text-gray-900 font-medium">
                  {bookingData.user.user_name ||
                    `${bookingData.user.first_name} ${bookingData.user.last_name}`}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email Address</span>
                <span className="text-gray-900 font-medium">
                  {bookingData.user.email}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone Number</span>
                <span className="text-gray-900 font-medium">
                  {bookingData.user.phone_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Created Date</span>
                <span className="text-gray-900 font-medium">
                  {new Date(reservation.reservation_date).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Expiry Date</span>
                <span className="text-gray-900 font-medium">
                  {reservation.expiry_date
                    ? new Date(reservation.expiry_date).toLocaleDateString()
                    : "N/A"}
                </span>
              </div>
            </div>
            <Button className="w-full mt-4 bg-teal-600 hover:bg-teal-700 text-white">
              Download Bookings
            </Button>
          </div>

          {/* Unit Information */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Unit Information
            </h3>
            <div className="text-center mb-4 p-4 bg-gray-50 rounded-lg">
              <p className="text-3xl font-bold text-gray-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: country.currency === "EGP" ? "EGP" : "USD",
                }).format(Number(property.property_price))}
              </p>
              <p className="text-sm text-gray-600 mt-1">Unit Price</p>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Project</span>
                <span className="text-gray-900 font-medium">
                  {property.property_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Property</span>
                <span className="text-gray-900 font-medium">
                  {property.property_name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Property Number</span>
                <span className="text-gray-900 font-medium">
                  {property.property_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Types</span>
                <span className="text-gray-900 font-medium capitalize">
                  {property?.property_type_name || "N/A"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Country</span>
                <span className="text-gray-900 font-medium">
                  {country.name}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Status</span>
                <span className="text-gray-900 font-medium capitalize">
                  {reservation.reservation_status}
                </span>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-semibold text-gray-900 mb-2">
                Payment Plan
              </h4>
              <p className="text-sm text-gray-600 mb-3">
                {paymentPlan.description}
              </p>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Plan Type</span>
                  <span className="font-semibold text-gray-900 capitalize">
                    {paymentPlan.payment_plan_type}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Total Cost</span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice(paymentPlan.total_cost, country.currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
