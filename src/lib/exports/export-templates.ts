import * as XLSX from "xlsx";

export const ProjectsTemplate = () => {
  const headers = [
    "project_id",
    "developer_id",
    "location_id",
    "project_name",
    "project_type",
    "total_units",
    "availabe_units",
    "launch_date",
    "completion_date",
    "status",
    "price_range",
    "price_range_SQ",
    "description",
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([headers]);

  const columnWidths = headers.map((header) => ({
    wch: header.length + 5,
  }));

  worksheet["!cols"] = columnWidths;
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");

  XLSX.writeFile(workbook, "Empty_Projects_Template.xlsx");
};

export const MultiTemplate = () => {
  const headers = [
    "developer name",
    "project_name",
    "project_type",
    "total_units",
    "availabe_units",
    "launch_date",
    "completion_date",
    "status",
    "price_range",
    "price_range_SQ",
    "description",
    "google_map_link",
    "north_side",
    "south_side",
    "east_side",
    "west_side",
    "landmark",
    "city_id",
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([headers]);

  const columnWidths = headers.map((header) => ({
    wch: header.length + 5,
  }));

  worksheet["!cols"] = columnWidths;
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Multi");

  XLSX.writeFile(workbook, "Empty_Multi_Template.xlsx");
};

export const PropertiesTemplate = () => {
  const headers = [
    "property_name",
    "property_no",
    "property_type_id",
    "property_subtype_id",
    "plot_size",
    "bua_size",
    "price",
    "size",
    "maid_room ",
    "finishing_status",
    "furnish_status",
    " bedrooms",
    "bathrooms",
    " parking_spaces",
    "building_name",
    "building_community",
    "building_commuinty_compelation_date",
    "description",
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([headers]);

  const columnWidths = headers.map((header) => ({
    wch: header.length + 5, 
  }));

  worksheet["!cols"] = columnWidths;
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

  XLSX.writeFile(workbook, "Empty_Properties_Template.xlsx");
};

export const PropertiesFilledTemplate = async (
  projectId: number,
  token: string,
) => {
  let enrichedProperties = [];
  let projectName = "";
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/projects/${projectId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    const resJson: any = await res.json();
    const data = await resJson.data;
    projectName = await data.project_name;
    const buildings = await data.buildings;
    const props = await data.properties;
    enrichedProperties = props.map((property: any) => {
      const building = buildings.find(
        (b: any) => b.building_id === property.building_id,
      );

      return {
        ...property,
        building_name: building?.building_name || null,
        completion_date: building?.completion_date || null,
        built_type: building?.built_type || null,
      };
    });
  } catch (error) {
    console.log(error);
  }

  const headers = [
    "property_name",
    "property_no",
    "property_type_id",
    "property_subtype_id",
    "plot_size",
    "bua_size",
    "price",
    "size",
    "maid_room ",
    "finishing_status",
    "furnish_status",
    " bedrooms",
    "bathrooms",
    " parking_spaces",
    "building_name",
    "building_community",
    "building_commuinty_compelation_date",
    "description",
  ];

  const rows = enrichedProperties.map((item: any) => [
    item.property_name || "",
    item.property_no || "",
    item.propertytype == null ? "" : item.propertytype?.name || "",
    item.propertysubtype == null ? "" : item.propertysubtype?.name || "",
    item.plot_size || "",
    item.bua_size || "",
    item.price || "",
    item.size || "",
    item.maid_room || "",
    item.finishing_status || "",
    item.furnish_status || "",
    item.bedrooms || "",
    item.bathrooms || "",
    item.parking_spaces || "",
    item.building_name || "",
    item.built_type || "",
    item.completion_date || "",
    item.description,
  ]);

  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  const columnWidths = headers.map((header) => ({
    wch: header.length + 5, 
  }));

  worksheet["!cols"] = columnWidths;
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

  XLSX.writeFile(workbook, `${projectName}_Properties_Template.xlsx`);
};
