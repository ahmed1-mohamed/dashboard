"use client";

import { useQuery } from "@tanstack/react-query";
import {
    DashboardExpertService
} from "@/services/DashboardExpertService";
import { Country } from "@/types/expertDashboard/profile";


export function useProfile(expertId: number) {
    return useQuery({
        queryKey: ["expertProfile", expertId],
        queryFn: () => DashboardExpertService.getProfileInformation(expertId),
        retry: false,
    });
}

export function useLanguagesList() {
    return useQuery({
        queryKey: ["languagesList"],
        queryFn: () =>
            DashboardExpertService.getLanguagesList(),
        select: (data) => data?.data?.data,
    });
}

export function useCategoriesList() {
    return useQuery({
        queryKey: ["categoriesList"],
        queryFn: () =>
            DashboardExpertService.getCategoriesList(),
        select: (data) => data?.data?.data,
    });
}

export function useCountriesList() {
    return useQuery({
        queryKey: ["countriesList"],
        queryFn: () =>
            DashboardExpertService.getCountriesList(),
        select: (data) => data?.data,
    });
}
