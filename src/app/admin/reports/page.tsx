"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle,
  XCircle,
  TrendingUp,
  FileText,
  Copy,
  AlertTriangle,
} from "lucide-react";

export default function ReportsPage() {
  const [report, setReport] = useState<any>(null);
  const [pName, setPName] = useState<any>(null);

  useEffect(() => {
    const raw = localStorage.getItem("report");
    const projectName = localStorage.getItem("projectName");

    if (raw) {
      try {
        setReport(JSON.parse(raw));
      } catch {
        setReport(null);
      }
    }
    if (projectName) {
      try {
        setPName(projectName);
      } catch {
        setPName(null);
      }
    }
  }, []);

  if (!report) {
    return (
      <div className="mx-auto max-w-4xl p-6">
        <div className="text-center text-gray-500">
          No report data available
        </div>
      </div>
    );
  }

  const {
    inserted = [],
    updated = [],
    duplicates = [],
    errors = [],
  } = report.data;

  // Calculate statistics
  const totalProcessed =
    inserted.length + updated.length + duplicates.length + errors.length;
  const successCount = inserted.length + updated.length;
  const successRate =
    totalProcessed > 0 ? ((successCount / totalProcessed) * 100).toFixed(1) : 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-6">
      <div className="item-center flex justify-center text-lg">{pName}</div>
      {/* Header */}
      <div className="rounded-lg border bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center gap-3">
          {report.success ? (
            <CheckCircle className="h-8 w-8 text-green-500" />
          ) : (
            <XCircle className="h-8 w-8 text-red-500" />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Import Report</h1>
            <p
              className={`text-sm ${
                report.success ? "text-green-600" : "text-red-600"
              }`}
            >
              {report.message}
            </p>
          </div>
        </div>

        {/* Summary Statistics */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-lg border border-green-200 bg-green-50 p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-800">
                Inserted
              </span>
            </div>
            <div className="mt-1 text-2xl font-bold text-green-900">
              {inserted.length}
            </div>
          </div>

          <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-800">Updated</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-blue-900">
              {updated.length}
            </div>
          </div>

          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <div className="flex items-center gap-2">
              <Copy className="h-5 w-5 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800">
                Duplicates
              </span>
            </div>
            <div className="mt-1 text-2xl font-bold text-yellow-900">
              {duplicates.length}
            </div>
          </div>

          <div className="rounded-lg border border-red-200 bg-red-50 p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <span className="text-sm font-medium text-red-800">Errors</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-red-900">
              {errors.length}
            </div>
          </div>
        </div>

        {/* Success Rate */}
        <div className="mt-4 rounded-lg bg-gray-50 p-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-gray-700">Success Rate</span>
            <span
              className={`text-lg font-bold ${
                Number(successRate) >= 80
                  ? "text-green-600"
                  : Number(successRate) >= 50
                    ? "text-yellow-600"
                    : "text-red-600"
              }`}
            >
              {successRate}%
            </span>
          </div>
          <div className="mt-2 h-2 w-full rounded-full bg-gray-200">
            <div
              className={`h-2 rounded-full ${
                Number(successRate) >= 80
                  ? "bg-green-500"
                  : Number(successRate) >= 50
                    ? "bg-yellow-500"
                    : "bg-red-500"
              }`}
              style={{ width: `${successRate}%` }}
            />
          </div>
          <div className="mt-1 text-sm text-gray-600">
            {successCount} of {totalProcessed} records processed successfully
          </div>
        </div>
      </div>

      {/* Detailed Sections */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Successful Operations */}
        {(inserted.length > 0 || updated.length > 0) && (
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b bg-green-50 p-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-green-800">
                <CheckCircle className="h-5 w-5" />
                Successful Operations
              </h2>
            </div>
            <div className="space-y-4 p-4">
              {inserted.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">
                    Inserted Records ({inserted.length})
                  </h3>
                  <div className="rounded border bg-green-50 p-3">
                    <div className="text-sm text-green-800">
                      {inserted.length} new records were successfully added to
                      the database.
                    </div>
                  </div>
                </div>
              )}

              {updated.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">
                    Updated Records ({updated.length})
                  </h3>
                  <div className="rounded border bg-blue-50 p-3">
                    <div className="text-sm text-blue-800">
                      {updated.length} existing records were successfully
                      updated.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Issues */}
        {(duplicates.length > 0 || errors.length > 0) && (
          <div className="rounded-lg border bg-white shadow-sm">
            <div className="border-b bg-red-50 p-4">
              <h2 className="flex items-center gap-2 text-lg font-semibold text-red-800">
                <AlertTriangle className="h-5 w-5" />
                Issues Found
              </h2>
            </div>
            <div className="space-y-4 p-4">
              {duplicates.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">
                    Duplicate Records ({duplicates.length})
                  </h3>
                  <div className="rounded border bg-yellow-50 p-3">
                    <div className="text-sm text-yellow-800">
                      {duplicates.length} records were skipped because they
                      already exist in the database.
                    </div>
                  </div>
                </div>
              )}

              {errors.length > 0 && (
                <div>
                  <h3 className="mb-2 font-medium text-gray-900">
                    Failed Records ({errors.length})
                  </h3>
                  <div className="rounded border bg-red-50 p-3">
                    <div className="mb-2 text-sm text-red-800">
                      {errors.length} records failed to import due to validation
                      errors.
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detailed Error Report */}
      {errors.length > 0 && (
        <div className="rounded-lg border bg-white shadow-sm">
          <div className="border-b bg-red-50 p-4">
            <h2 className="flex items-center gap-2 text-lg font-semibold text-red-800">
              <XCircle className="h-5 w-5" />
              Error Details
            </h2>
            <p className="mt-1 text-sm text-red-600">
              Review and fix these issues before re-importing
            </p>
          </div>
          <div className="over-flow-hidden max-h-96 divide-y divide-gray-200 overflow-y-auto">
            {errors.map((errorItem: any, index: any) => (
              <div key={index} className="p-4">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                      <span className="text-sm font-medium text-red-800">
                        {errorItem.row}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="mb-2 font-medium text-gray-900">
                      Row {errorItem.row} - Validation Errors
                    </h4>
                    <div className="space-y-2">
                      {typeof errorItem.error === "string" ? (
                        // Case 1: error is just a string
                        <div className="rounded border-l-4 border-red-400 bg-red-50 p-3">
                          <div className="flex items-start gap-2">
                            <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                            <div className="text-sm text-red-700">
                              {errorItem.error}
                            </div>
                          </div>
                        </div>
                      ) : (
                        // Case 2: error is an object with keys + string/string[] values
                        Object.entries(
                          errorItem.error as Record<string, string | string[]>,
                        ).map(([field, messages]) => (
                          <div
                            key={field}
                            className="rounded border-l-4 border-red-400 bg-red-50 p-3"
                          >
                            <div className="flex items-start gap-2">
                              <AlertTriangle className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-500" />
                              <div>
                                <div className="text-sm font-medium text-red-800">
                                  {field
                                    .replace(/_/g, " ")
                                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                                </div>
                                <div className="mt-1 text-sm text-red-700">
                                  {Array.isArray(messages)
                                    ? messages.join(", ")
                                    : messages}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Action Recommendations */}
      {errors.length > 0 && (
        <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
          <h3 className="mb-2 font-medium text-blue-900">📝 Next Steps</h3>
          <ul className="space-y-1 text-sm text-blue-800">
            <li>• Review the error details above and fix the data issues</li>
            <li>• Ensure price fields contain valid numeric values</li>
            <li>• Verify building community references are valid</li>
            <li>• Check date formats for completion dates</li>
            <li>• Re-import the corrected data</li>
          </ul>
        </div>
      )}
    </div>
  );
}
