import * as XLSX from "xlsx";

export const propertiesExportToExcel = (data: any[]) => {
  const formattedData = data.map((property: any) => ({
    "property_name": property.property_name ?? "",
    "property_no": property.property_no ?? "",
    "property_type_id": property.propertytype?.id ?? property.property_type_id ?? "",
    "property_subtype_id": property.propertysubtype?.id ?? property.property_subtype_id ?? "",
    "project_id": property.project_id ?? "",
    "location_id": property.location_id ?? "",
    "building_id": property.building_id ?? "",
    "plot_size": property.plot_size ?? "",
    "bua_size": property.bua_size ?? "",
    "maid_room": property.maid_room ? 1 : 0,
    "status": property.status ?? "",
    "furnish_status": property.furnish_status ?? "",
    "finishing_status": property.finishing_status ?? "",
    "price": property.price ?? "",
    "size": property.size ?? "",
    "bedrooms": property.bedrooms ?? 0,
    "bathrooms": property.bathrooms ?? 0,
    "parking_spaces": property.parking_spaces ?? 0,
    "availability_status": property.availability_status ?? "",
    "construction_status": property.construction_status ?? "",
    "description": property.description ?? "",
    "reference_listed": property.reference_listed ?? "",
    "ownership_type": property.ownership_type ?? "",
    "broker_license": property.broker_license ?? "",
    "agent_license": property.agent_license ?? "",
    "zone_name": property.zone_name ?? "",
    "dld_permit_number": property.dld_permit_number ?? "",
    "dld_barcode": property.dld_barcode ?? "",
    "created_at": property.created_at ?? "",
    "updated_at": property.updated_at ?? "",
    "deleted_at": property.deleted_at ?? "",
    "views_count": property.views_count ?? 0,
    "is_active": property.is_active ? 1 : 0,
    "plan_type": property.plan_type ?? "",
    "slug": property.slug ?? "",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  // Calculate column widths automatically
  const header = Object.keys(formattedData[0] || {});
  const columnWidths = header.map((h) => ({
    wch: Math.max(
      h.length,
      ...formattedData.map((row: any) => (row[h] ? row[h].toString().length : 10))
    ) + 2,
  }));
  
  worksheet["!cols"] = columnWidths;
  
  // Freeze the top row for better viewing
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");
  XLSX.writeFile(workbook, "Properties_Export.xlsx");
};
