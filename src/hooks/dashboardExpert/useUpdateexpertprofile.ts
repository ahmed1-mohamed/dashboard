import { UpdateExpertValues } from "@/validators/dashboardExpert/updateExpertSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DashboardExpertService } from "@/services/DashboardExpertService";

function buildFormData(expertId: number, values: UpdateExpertValues): FormData {
    const fd = new FormData();

    if (values.full_name) fd.append("display_name", values.full_name);
    if (values.email) fd.append("email", values.email);
    if (values.phone_number) fd.append("phone_number", values.phone_number);
    if (values.title !== undefined) fd.append("title", values.title ?? "");
    if (values.bio !== undefined) fd.append("bio", values.bio ?? "");
    if (values.years_experience !== undefined)
        fd.append("years_experience", String(values.years_experience));
    if (values.website !== undefined) fd.append("website", values.website ?? "");
    if (values.linkedin !== undefined) fd.append("linkedin", values.linkedin ?? "");
    if (values.podcast !== undefined) fd.append("podcast", values.podcast ? "1" : "0");

    values.languages?.forEach((id) => fd.append("languages[]", String(id)));
    values.categories?.forEach((id) => fd.append("categories[]", String(id)));
    values.countries?.forEach((id) => fd.append("countries[]", String(id)));

    values.certifications?.forEach((cert, i) =>
        fd.append(`certifications[${i}][cert_name]`, cert.cert_name)
    );

    if (values.photo instanceof File) {
        fd.append("photo", values.photo);
    }

    return fd;
}

export function useUpdateExpertProfile(expertId: number) {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (values: UpdateExpertValues) => {
            const payload = buildFormData(expertId, values);
            return DashboardExpertService.updateProfileInformation(expertId, payload);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["expertProfile", expertId] });
        },
    });
}
