"use client";

import { useQuery } from "@tanstack/react-query";
import { AdminExpertsService } from "@/services/AdminExpertsService";

export function useEditExpertData(expertId: number | null, isOpen: boolean) {
  const { data: languagesData, isLoading: languagesLoading } = useQuery({
    queryKey: ["expert-languages"],
    queryFn: () => AdminExpertsService.getLanguages(),
    enabled: isOpen,
  });

  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ["expert-categories"],
    queryFn: () => AdminExpertsService.getCategories(),
    enabled: isOpen,
  });

  const { data: countriesData, isLoading: countriesLoading } = useQuery({
    queryKey: ["countries"],
    queryFn: () => AdminExpertsService.getCountries(),
    enabled: isOpen,
  });

  const { data: expertData, isLoading: expertLoading } = useQuery({
    queryKey: ["expertDetails", expertId],
    queryFn: () => AdminExpertsService.getExpert(expertId!),
    enabled: !!expertId && isOpen,
  });

  const languages = languagesData?.data || [];
  const categories = categoriesData?.data || [];
  const countries = countriesData?.data || [];
  const loading = languagesLoading || categoriesLoading || countriesLoading || expertLoading;

  return {
    languages,
    categories,
    countries,
    expertData,
    loading,
  };
}