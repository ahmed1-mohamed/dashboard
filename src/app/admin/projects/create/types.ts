export interface LocationData {
  latitude: number;
  longitude: number;
  landmark: string;
  city_id: string;
  north_side: string;
  south_side: string;
  east_side: string;
  west_side: string;
  google_map_link: string;
  area_id?: string;
}

export type Option = {
  label: string;
  value: string;
};

// Media Item interface for handling multiple media files
export interface MediaItem {
  file?: File;
  originalFile?: File;
  description: string;
  is_primary: boolean;
  my_order: boolean;
  preview: string;
  isProcessed: boolean;
  media_type: "image" | "video" | "floor_plan" | "3D_tour";
  media_url?: string;
  originalSize?: number;
  compressedSize?: number;
  resizedWidth?: number;
  resizedHeight?: number;
}

// Processing configuration
export interface ProcessingConfig {
  enabled: boolean;
  imageSize: { width: number; height: number };
  maxSizeMB: number;
  quality: number;
  watermarkEnabled: boolean;
  watermarkOpacity: number;
  watermarkPosition:
    | "top-left"
    | "top-right"
    | "bottom-left"
    | "bottom-right"
    | "center";
  maintainAspectRatio: boolean;
  watermarkSize: number;
}
