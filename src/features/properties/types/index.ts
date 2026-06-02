export interface Property {
  id: number;
  unitNumber: string;
  project_name: string;
  type: string;
  area: string;
  floor: string;
  price: string;
  property_name: string;
  status: "Reserved" | "Available";
}
