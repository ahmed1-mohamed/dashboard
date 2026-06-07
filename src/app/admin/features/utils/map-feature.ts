import { Feature } from "../components/FeaturesTable";
import { FeaturesDataType } from "@/types";

export interface ApiFeature {
  feature_id: number;
  feature_name: string;
  is_amenity: number;
  icons: string | null;
}


export function unpackAndMapFeaturesResponse(apiData: unknown): Feature[] {
  const data = apiData as { data?: { data?: ApiFeature[] } };
  const rawArray = data?.data?.data;

  if (Array.isArray(rawArray)) {
    return rawArray.map((f: ApiFeature, index: number) => ({
      id: f.feature_id || index,
      featureName: f.feature_name || "N/A",
      isAmenity: f.is_amenity === 1,
      icon: f.icons || "",
    }));
  }

  return [];
}
