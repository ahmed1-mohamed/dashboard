// Coupon Types
export enum CouponType {
  PERCENTAGE = "percentage",
  FIXED = "fixed",
}

// Project Types
export enum ProjectType {
  RESIDENTIAL = "Residential",
  COMMERCIAL = "Commercial",
  MIXED_USE = "Mixed Use",
}

// Project Status
export enum ProjectStatus {
  ONGOING = "Ongoing",
  COMPLETED = "Completed",
  UPCOMING = "Upcoming",
}

// User Status
export enum UserStatus {
  ACTIVE = "active",
  INACTIVE = "inactive",
  BANNED = "banned",
}

// Reservation Status
export enum ReservationStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  CANCELLED = "cancelled",
  EXPIRED = "expired",
}

// Property Status
export enum PropertyStatus {
  AVAILABLE = "available",
  RESERVED = "reserved",
  SOLD = "sold",
  UNAVAILABLE = "unavailable",
}

// Construction Status
export enum ConstructionStatus {
  NOT_STARTED = "not_started",
  IN_PROGRESS = "in_progress",
  COMPLETED = "completed",
  ON_HOLD = "on_hold",
}

// Furnish Status
export enum FurnishStatus {
  UNFURNISHED = "unfurnished",
  SEMI_FURNISHED = "semi_furnished",
  FULLY_FURNISHED = "fully_furnished",
}

// Finishing Status
export enum FinishingStatus {
  BASIC = "basic",
  STANDARD = "standard",
  PREMIUM = "premium",
  LUXURY = "luxury",
}

// Meeting Request Status
export enum MeetingRequestStatus {
  PENDING = "pending",
  APPROVED = "approved",
  REJECTED = "rejected",
  COMPLETED = "completed",
}
