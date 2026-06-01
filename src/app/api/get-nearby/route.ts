import { NextRequest, NextResponse } from "next/server";

const API_KEY =
  process.env.GOOGLE_MAPS_API_KEY || "AIzaSyA7pPVZpga50Hvurvanqkal3QEF9LPbG-g";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get("lat") || "0");
  const lng = parseFloat(searchParams.get("lng") || "0");

  if (!lat || !lng) {
    return NextResponse.json({ error: "Missing coordinates" }, { status: 400 });
  }

  try {
    const radius = 500; // meters
    const directions = [
      { name: "north", lat: lat + 0.005, lng },
      { name: "south", lat: lat - 0.005, lng },
      { name: "east", lat, lng: lng + 0.005 },
      { name: "west", lat, lng: lng - 0.005 },
    ];

    const results: Record<string, string> = {};

    for (const dir of directions) {
      try {
        const response = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${dir.lat},${dir.lng}&radius=${radius}&key=${API_KEY}`,
        );
        const data: any = await response.json();

        if (data.results && data.results.length > 0) {
          results[dir.name] = data.results[0].name;
        } else {
          results[dir.name] = "N/A";
        }
      } catch (error) {
        results[dir.name] = "N/A";
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Error fetching nearby places:", error);
    return NextResponse.json(
      { error: "Failed to fetch nearby places" },
      { status: 500 },
    );
  }
}
