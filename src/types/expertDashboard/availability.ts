export interface AvailabilitySlot {
  id: number;
  expert_id: number;
  day: string;
  from_time: string;
  to_time: string;
  timezone: string;
}

export interface WeekdaySchedule {
  enabled: boolean;
  slots: [string, string][];
}

export type WeeklyAvailability = {
  status: boolean;
  message: string;
  data: {
    sunday: {
      enabled: boolean;
      slots?: { from: string; to: string }[];
    };
    monday: {
      enabled: boolean;
      slots?: { from: string; to: string }[];
    };
    tuesday: {
      enabled: boolean;
      slots?: { from: string; to: string }[];
    };
    wednesday: {
      enabled: boolean;
      slots?: { from: string; to: string }[];
    };
    thursday: {
      enabled: boolean;
      slots?: { from: string; to: string }[];
    };
    friday: {
      enabled: boolean;
      slots?: { from: string; to: string }[];
    };
    saturday: {
      enabled: boolean;
      slots?: { from: string; to: string }[];
    };
  };
};

export interface Slot {
  id: number;
  from: string;
  to: string;
}

export interface SlotDialogState {
  open: boolean;
  mode: "add" | "edit";
  day: string;
  slots: { id?: string; from: string; to: string }[];
}

export interface DeleteDialogState {
  open: boolean;
  day: string;
  slot?: Slot;
}

export interface AvailabilityException {
  expert_id: number;
  exception_id: number;
  start_date: string;
  end_date: string;
  available: boolean;
  updated_at: string;
  created_at: string;
}

export type AvailabilityExceptionRes = {
  status: boolean;
  message: string;
  data: AvailabilityException[];
};



export type TabMode = "custom" | "same";

export interface TimeSlot {
  from: string; 
  to: string;
  exceptionId?: number; 
}

export interface DaySlots {
  date: string; 
  label: string; 
  slots: TimeSlot[];
}

export interface ExceptionFormState {
  fromDate: string;
  toDate: string;
  tabMode: TabMode;
  sameSlots: TimeSlot[];
  customDays: DaySlots[];
}

export interface GroupedEntry {
  key: string; 
  label: string;
  isAllDay: boolean;
  slots: { from: string; to: string }[];
  exceptions: AvailabilityException[]; 
}

export interface ExceptionModalFormProps {
  open: boolean;
  onClose: () => void;
  expertId: number;
  isEditing: boolean;
  initialState: ExceptionFormState;
  editGroup?: GroupedEntry;
}
