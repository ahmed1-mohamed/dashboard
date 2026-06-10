export const constructionStatusOptions = [
  { label: "Ready", value: "ready" },
  { label: "Under Construction", value: "under-construction" },
  { label: "Off Plan", value: "off-plan" },
] as const;

export const availabilityStatusOptions = [
  { label: "Available", value: "available" },
  { label: "Reserved", value: "reserved" },
  { label: "Sold", value: "sold" },
] as const;

export const statusOptions = [
  { label: "Active", value: "active" },
  { label: "Inactive", value: "inactive" },
] as const;

export const furnishStatusOptions = [
  { label: "Furnished", value: "furnished" },
  { label: "UnFurnished", value: "unfurnished" },
  { label: "SemiFurnished", value: "semi-furnished" },
] as const;

export const finishingStatusOptions = [
  { label: "Finished", value: "finished" },
  { label: "SemiFinished", value: "semi-finished" },
  { label: "UnFinished", value: "unfinished" },
] as const;

export const ownershipTypeOptions = [
  { label: "Freehold", value: "freehold" },
  { label: "Leasehold", value: "leasehold" },
] as const;

export const viewOptions = [
  { label: "Sea View", value: "sea" },
  { label: "City View", value: "city" },
  { label: "Garden View", value: "garden" },
] as const;

export const currencyOptions = [
  { label: "AED", value: "aed" },
  { label: "USD", value: "usd" },
  { label: "EGP", value: "egp" },
] as const;
