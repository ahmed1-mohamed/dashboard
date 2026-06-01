import { NextRequest, NextResponse } from "next/server";
import { DeveloperDataType } from "@/types";

// Constants for pagination
const DEFAULT_PAGE = 1;
const DEFAULT_PER_PAGE = 10;
const MAX_PER_PAGE = 100;

// Interface for the paginated response
interface PaginatedDevelopersResponse {
  status: boolean;
  message: string;
  total: number;
  data: DeveloperDataType[];
}

// Interface for error response
interface ErrorResponse {
  status: boolean;
  message: string;
  errors?: Record<string, string[]>;
}

/**
 * Validates pagination parameters
 * @param page - Page number (1-based)
 * @param per_page - Items per page
 * @returns Object with validated values and any errors
 */
function validatePaginationParams(
  page: string | null,
  per_page: string | null,
): { validatedPage: number; validatedPerPage: number; errors: string[] } {
  const errors: string[] = [];
  let validatedPage = DEFAULT_PAGE;
  let validatedPerPage = DEFAULT_PER_PAGE;

  // Validate page parameter
  if (page !== null) {
    const pageNum = parseInt(page, 10);
    if (isNaN(pageNum)) {
      errors.push("Page must be a valid number");
    } else if (pageNum < 1) {
      errors.push("Page must be greater than 0");
    } else {
      validatedPage = pageNum;
    }
  }

  // Validate per_page parameter
  if (per_page !== null) {
    const perPageNum = parseInt(per_page, 10);
    if (isNaN(perPageNum)) {
      errors.push("Per page must be a valid number");
    } else if (perPageNum < 1) {
      errors.push("Per page must be greater than 0");
    } else if (perPageNum > MAX_PER_PAGE) {
      errors.push(`Per page cannot exceed ${MAX_PER_PAGE}`);
    } else {
      validatedPerPage = perPageNum;
    }
  }

  return { validatedPage, validatedPerPage, errors };
}

/**
 * Fetches developers from the backend API with pagination
 * @param page - Page number (1-based)
 * @param per_page - Items per page
 * @returns Tuple of [developers, totalCount] or null if the API call fails
 */
async function fetchDevelopersFromApi(
  page: number,
  per_page: number,
): Promise<{ data: DeveloperDataType[]; total: number } | null> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL is not defined");
    return null;
  }

  try {
    const response = await fetch(
      `${apiUrl}/developers?page=${page}&per_page=${per_page}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      console.error(
        `Failed to fetch developers: HTTP ${response.status} ${response.statusText}`,
      );
      return null;
    }

    const responseData = await response.json();

    // Handle different response formats
    if (Array.isArray(responseData)) {
      return { data: responseData, total: responseData.length };
    }

    if (responseData.data && Array.isArray(responseData.data)) {
      return {
        data: responseData.data,
        total: responseData.total || responseData.data.length,
      };
    }

    if (responseData.developers && Array.isArray(responseData.developers)) {
      return {
        data: responseData.developers,
        total: responseData.total || responseData.developers.length,
      };
    }

    // If we can't parse the response, return empty
    console.error("Unexpected response format from developers API");
    return null;
  } catch (error) {
    console.error("Error fetching developers from API:", error);
    return null;
  }
}

/**
 * GET endpoint for fetching developers with pagination
 * Query parameters:
 * - page: Page number (1-based, default: 1)
 * - per_page: Items per page (default: 10, max: 100)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const page = searchParams.get("page");
  const per_page = searchParams.get("per_page");

  // Validate pagination parameters
  const { validatedPage, validatedPerPage, errors } =
    validatePaginationParams(page, per_page);

  // Return validation errors if any
  if (errors.length > 0) {
    const errorResponse: ErrorResponse = {
      status: false,
      message: "Invalid pagination parameters",
      errors: {
        parameters: errors,
      },
    };
    return NextResponse.json(errorResponse, { status: 400 });
  }

  try {
    // Fetch developers from the backend API
    const result = await fetchDevelopersFromApi(validatedPage, validatedPerPage);

    if (result === null) {
      // If the API call failed, return an empty response with the expected structure
      const errorResponse: ErrorResponse = {
        status: false,
        message: "Failed to fetch developers from the server",
      };
      return NextResponse.json(errorResponse, { status: 500 });
    }

    const { data: developers, total } = result;

    // Check if the requested page is beyond the available range
    const totalPages = Math.ceil(total / validatedPerPage);
    if (validatedPage > totalPages && total > 0) {
      const errorResponse: ErrorResponse = {
        status: false,
        message: `Page ${validatedPage} is beyond the available range. Total pages: ${totalPages}`,
      };
      return NextResponse.json(errorResponse, { status: 404 });
    }

    // Return successful paginated response
    const successResponse: PaginatedDevelopersResponse = {
      status: true,
      message: "Developers fetched successfully",
      total,
      data: developers,
    };

    return NextResponse.json(successResponse, { status: 200 });
  } catch (error) {
    console.error("Unexpected error in GET /api/developers:", error);

    const errorResponse: ErrorResponse = {
      status: false,
      message: "An unexpected error occurred",
    };

    return NextResponse.json(errorResponse, { status: 500 });
  }
}
