import { Property } from "../types";


export function mapProperty(prop: any): Property {
  return {
    id: prop.property_id,
    unitNumber: prop.property_no || prop.property_name || "N/A",
    project_name: prop.project_name?.toString() || "N/A",
    type: prop.type || prop.property_subtype || "N/A",
    area: prop.size ? `${prop.size} sqm` : prop.plot_size ? `${prop.plot_size} sqm` : "N/A",
    floor: "N/A",
    price: prop.price ? `${Number(prop.price).toLocaleString()} AED` : "N/A",
    property_name: prop.property_name?.toString() || "N/A",
    status: prop.availability_status === "available" ? "Available" : "Reserved",
  };
}
