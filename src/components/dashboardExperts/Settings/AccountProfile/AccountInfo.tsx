"use client";

import { useEffect } from "react";
import { useForm, Controller, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Info, Save } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

import { useToken } from "@/contexts/SessionProviderWrapper";
import ImgPicker from "./ImgPicker";

import {
  UpdateExpertValues, updateExpertSchema
} from "@/validators/dashboardExpert/updateExpertSchema";
import { useUpdateExpertProfile } from "@/hooks/dashboardExpert/useUpdateexpertprofile";
import {
  useProfile,
  useLanguagesList,
  useCategoriesList,
  useCountriesList,
} from "@/hooks/dashboardExpert/useProfile";
import { MultiSelect } from "@/components/ui/multi-select";
import { FieldLabel } from "./FieldLabel";
import { CertificationsSection } from "./CertificationsSection";
import { CategoryOption, Country, LanguageOption } from "@/types/expertDashboard/profile";
import { Switch } from "@/components/ui/switch";
import { RichTextEditor } from "../../DescriptionEditor";


export default function AccountInfo() {
  const { expertId } = useToken();

  const { data } = useProfile(expertId!);
  const profileData = data?.data?.data;

  const { data: allLanguages = [] } = useLanguagesList();
  const { data: allCategories = [] } = useCategoriesList();
  const { data: allCountries = [] } = useCountriesList();

  const { mutate: updateProfile, isPending } = useUpdateExpertProfile(expertId!);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateExpertValues>({
    resolver: zodResolver(updateExpertSchema) as Resolver<UpdateExpertValues>
  });

  useEffect(() => {
    if (!profileData) return;

    reset({
      full_name: profileData.display_name,
      email: profileData.user.email,
      phone_number: profileData.user.phone_number,
      title: profileData.title ?? "",
      bio: profileData.bio ?? "",
      years_experience: profileData.years_experience,
      website: profileData.website ?? "",
      linkedin: profileData.linkedin ?? "",
      languages: profileData.languages.map((l) => l.language_id),
      categories: profileData.categories.map((c) => c.category_id),
      countries: profileData.countries.map((c) => c.id),
      certifications: profileData.certifications,
      podcast: Boolean(profileData.podcast),
      photo: profileData.photo_url
        ? { url: profileData.photo_url, existingFile: true }
        : undefined,
    });
  }, [profileData, reset]);

  if (!profileData) return null;

  const languageOptions = allLanguages.map((l: LanguageOption) => ({
    value: l.language_id,
    label: l.name,
  }));

  const categoryOptions = allCategories.map((c: CategoryOption) => ({
    value: c.category_id,
    label: c.name,
  }));

  const countryOptions = allCountries.map((c: Country) => ({
    value: c.id,
    label: c.name,
  }));

  const onSubmit = (values: UpdateExpertValues) => {
    updateProfile(values, {
      onSuccess: () => toast.success("Profile updated successfully"),
      onError: () => toast.error("Failed to update profile. Please try again."),
    });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="border border-[#E5E7EB] bg-white p-6 flex flex-col gap-6 rounded-[8px]"
    >

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h1 className="text-[20px] font-semibold text-[#15042B]">Account details</h1>
          <Info className="w-[13.33px] h-[13.33px] text-[#4A5565]" />
        </div>
      </div>

      <ImgPicker control={control} />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2.5">
          <FieldLabel label="Full name" required error={errors.full_name?.message} />
          <Input
            {...register("full_name")}
            placeholder="e.g. Bonnie Green"
            className={errors.full_name ? "border-red-400" : ""}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <FieldLabel label="Email address" required error={errors.email?.message} />
          <Input
            {...register("email")}
            disabled
            placeholder="e.g. name@company.com"
            className={errors.email ? "border-red-400" : ""}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <FieldLabel
          label="Title"
          tooltip="Your professional title"
          error={errors.title?.message}
        />
        <Input
          {...register("title")}
          placeholder="e.g. Senior Financial Advisor"
          className={errors.title ? "border-red-400" : ""}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2.5">
          <FieldLabel
            label="Specializations"
            required
            tooltip="Your area of expertise"
            error={
              Array.isArray(errors.categories)
                ? errors.categories[0]?.message
                : (errors.categories as { message?: string } | undefined)?.message
            }
          />
          <Controller
            name="categories"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={categoryOptions}
                selected={field.value ?? []}
                onChange={field.onChange}
                placeholder="Select specializations"
                hasError={!!errors.categories}
              />
            )}
          />
        </div>

        <div className="flex flex-col gap-2.5">
          <FieldLabel
            label="Languages"
            tooltip="Languages you speak"
            required
            error={
              Array.isArray(errors.languages)
                ? errors.languages[0]?.message
                : (errors.languages as { message?: string } | undefined)?.message
            }
          />
          <Controller
            name="languages"
            control={control}
            render={({ field }) => (
              <MultiSelect
                options={languageOptions}
                selected={field.value ?? []}
                onChange={field.onChange}
                placeholder="Select languages"
                hasError={!!errors.languages}
              />
            )}
          />
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <FieldLabel
          label="Service Areas"
          tooltip="Countries you serve"
          required
          error={
            Array.isArray(errors.countries)
              ? errors.countries[0]?.message
              : (errors.countries as { message?: string } | undefined)?.message
          }
        />
        <Controller
          name="countries"
          control={control}
          render={({ field }) => (
            <MultiSelect
              options={countryOptions}
              selected={field.value ?? []}
              onChange={field.onChange}
              placeholder="Select countries"
              hasError={!!errors.countries}
            />
          )}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <FieldLabel
          label="Professional Bio"
          required
          tooltip="Tell clients about yourself"
          error={errors.bio?.message}
        />
        <Controller
          name="bio"
          control={control}
          render={({ field }) => (
            <div className={errors.bio ? "rich-text-error-border" : ""}>
              <RichTextEditor
                value={field.value}
                onChange={field.onChange}
                placeholder="Write a short bio about yourself…"
              />
            </div>
          )}
        />

        {errors.bio && (
          <p className="text-sm text-red-400">{errors.bio.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2.5">
          <FieldLabel label="Phone number" required error={errors.phone_number?.message} />
          <Input
            {...register("phone_number")}
            disabled
            placeholder="e.g. +20 1234567890"
            className={errors.phone_number ? "border-red-400" : ""}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <FieldLabel
            label="Years of Experience"
            required
            tooltip="Total professional years"
            error={errors.years_experience?.message}
          />
          <Input
            {...register("years_experience")}
            type="number"
            min={0}
            className={errors.years_experience ? "border-red-400" : ""}
          />
        </div>
      </div>

      <CertificationsSection control={control} />

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-2.5">
          <FieldLabel
            label="Website"
            required
            tooltip="Your personal or company website"
            error={errors.website?.message}
          />
          <Input
            {...register("website")}
            placeholder="#"
            className={errors.website ? "border-red-400" : ""}
          />
        </div>
        <div className="flex flex-col gap-2.5">
          <FieldLabel
            label="LinkedIn"
            required
            tooltip="Your LinkedIn profile URL"
            error={errors.linkedin?.message}
          />
          <Input
            {...register("linkedin")}
            placeholder="#"
            className={errors.linkedin ? "border-red-400" : ""}
          />
        </div>
      </div>

      <div className="flex items-center gap-2.5">
        <Controller
          name="podcast"
          control={control}
          render={({ field }) => (
            <div className="flex items-center space-x-2">
              <Switch
                id="podcast"
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              <Label htmlFor="podcast" className="text-sm text-[#6A7282]">Podcast Module</Label>
            </div>
          )}
        />
      </div>

      <div className="flex justify-start pt-7 border-t border-[#F3F4F6]">
        <Button
          type="submit"
          disabled={isPending}
          className="flex items-center gap-2 bg-[#008081] hover:bg-[#008081] cursor-pointer"
        >
          <Save className="w-4 h-4" />
          {isPending ? "Saving…" : "Save changes"}
        </Button>
      </div>
    </form>
  );
}
