"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { fetchFeatures } from "@/data/api-client";

interface FeatureOption {
  feature_id: number;
  feature_name: string;
  is_amenity: number;
}

export function useAddProjectFeatureData(isOpen: boolean) {
  const { data: session } = useSession();
  const token = session?.user?.accessToken;

  const [features, setFeatures] = useState<FeatureOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !isOpen) return;

    const loadFeatures = async () => {
      setLoading(true);
      try {
        const response:any = await fetchFeatures(token);
        const featuresList: any[] = response?.data || [];
        const formattedFeatures: FeatureOption[] = featuresList.map((f: any) => ({
          feature_id: f.feature_id,
          feature_name: f.feature_name,
          is_amenity: f.is_amenity || 0,
        }));
        setFeatures(formattedFeatures);
      } catch (error) {
        console.error("Error loading features:", error);
      } finally {
        setLoading(false);
      }
    };

    loadFeatures();
  }, [token, isOpen]);

  return {
    features,
    loading,
  };
}