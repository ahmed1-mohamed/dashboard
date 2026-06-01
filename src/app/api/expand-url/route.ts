import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const shortUrl = searchParams.get("shortUrl");

  if (!shortUrl) {
    return NextResponse.json(
      { error: "Missing shortUrl parameter" },
      { status: 400 },
    );
  }

  try {
    // Follow redirects to get the full URL
    const response = await fetch(shortUrl, {
      method: "HEAD",
      redirect: "follow",
    });

    return NextResponse.json({ longUrl: response.url });
  } catch (error) {
    console.error("Error expanding URL:", error);
    return NextResponse.json(
      { error: "Failed to expand URL" },
      { status: 500 },
    );
  }
}
