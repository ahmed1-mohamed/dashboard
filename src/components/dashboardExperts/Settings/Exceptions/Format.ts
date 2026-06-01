import { AvailabilityException, ExceptionFormState, GroupedEntry, TimeSlot } from "@/types/expertDashboard/availability";

export function formatDateLabel(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}

export function formatDisplayDate(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function toApiDateTime(date: string, time: string): string {
  return `${date} ${time}:00`;
}

export function fromApiDateTime(dt: string): { date: string; time: string } {
  const clean = dt.replace("T", " ");
  const [date, timePart] = clean.split(" ");
  const time = timePart?.slice(0, 5) ?? "00:00";
  return { date, time };
}

export function formatTimeDisplay(time: string): string {
  if (!time) return "";
  const [h, m] = time.split(":").map(Number);
  const ampm = h >= 12 ? "PM" : "AM";
  const hour = h % 12 === 0 ? 12 : h % 12;
  return `${String(hour).padStart(2, "0")}:${String(m).padStart(2, "0")} ${ampm}`;
}

export function getDatesInRange(from: string, to: string): string[] {
  if (!from) return [];
  const result: string[] = [];
  const start = new Date(from + "T00:00:00");
  const end = to ? new Date(to + "T00:00:00") : start;
  const cur = new Date(start);
  while (cur <= end) {
    const y = cur.getFullYear();
    const m = String(cur.getMonth() + 1).padStart(2, "0");
    const d = String(cur.getDate()).padStart(2, "0");
    result.push(`${y}-${m}-${d}`);
    cur.setDate(cur.getDate() + 1);
  }
  return result;
}

export function groupExceptions(exceptions: AvailabilityException[]): GroupedEntry[] {

  const map = new Map<string, GroupedEntry>();

  for (const ex of exceptions) {
    const { date: sd, time: st } = fromApiDateTime(ex.start_date);
    const { date: ed, time: et } = fromApiDateTime(ex.end_date);
    const key = `${sd}|${ed}`;

    if (!map.has(key)) {
      map.set(key, {
        key,
        label: sd === ed ? formatDisplayDate(sd) : `${formatDisplayDate(sd)} – ${formatDisplayDate(ed)}`,
        isAllDay: false,
        slots: [],
        exceptions: [],
      });
    }

    const entry = map.get(key)!;
    entry.exceptions.push(ex);

    if (st === "00:00" && (et === "23:59" || et === "00:00")) {
      entry.isAllDay = true;
    } else {
      entry.slots.push({ from: formatTimeDisplay(st), to: formatTimeDisplay(et) });
    }
  }

  return Array.from(map.values());
}

export function defaultSlot(): TimeSlot {
  return { from: "09:00", to: "09:30" };
}

export function emptyForm(): ExceptionFormState {
  return {
    fromDate: "",
    toDate: "",
    tabMode: "same",
    sameSlots: [defaultSlot()],
    customDays: [],
  };
}
