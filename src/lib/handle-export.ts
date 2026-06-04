import jsPDF from "jspdf";
import * as XLSX from "xlsx";

// Developers
export const developersExportToPDF = (data: any[]) => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Developers Report", 14, 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  let yPos = 25;
  const lineSpacing = 7;
  const cardMargin = 20;
  const pageHeight = doc.internal.pageSize.height;
  const valueXPos = 50;

  data.forEach(({ developer_name, website, email, phone_number }: any) => {
    const cardHeight = 70;

    if (yPos + 80 > pageHeight) {
      doc.addPage();
      yPos = 25;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`Name:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(developer_name || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Email:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(email || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Phone:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(phone_number || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Website:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(website || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    yPos += cardMargin;
  });

  doc.save("Developers_Report.pdf");
};

export const developersExportToExcel = (data: any[]) => {
  const formattedData = data.map(
    ({ developer_name, email, phone_number, website }: any) => ({
      Name: developer_name ?? "N/A",
      Email: email ?? "N/A",
      "Phone Number": phone_number ?? "N/A",
      Website: website ?? "N/A",
    }),
  );

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  const header = Object.keys(formattedData[0] || {});
  const columnWidths = header.map((h) => ({
    wch:
      Math.max(
        h.length,
        ...formattedData.map((row: any) => row[h]?.toString().length || 10),
      ) + 2,
  }));
  worksheet["!cols"] = columnWidths;
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  XLSX.utils.book_append_sheet(workbook, worksheet, "Developers");
  XLSX.writeFile(workbook, "Developers_Report.xlsx");
};

// Projects
export const projectsExportToPDF = (data: any[]) => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Projects Report", 14, 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  let yPos = 25;
  const lineSpacing = 7;
  const cardMargin = 20;
  const pageHeight = doc.internal.pageSize.height;
  const valueXPos = 50;

  data.forEach(
    ({
      project_id,
      project_name,
      project_type,
      total_units,
      available_units,
      status,
      launch_date,
      completion_date,
      price_range,
      price_range_SQ,
      description,
      location,
    }: any) => {
      const cardHeight = 160;

      if (yPos + 40 > pageHeight) {
        doc.addPage();
        yPos = 25;
      }

      doc.setFillColor(240, 240, 240);
      doc.roundedRect(10, yPos - 4, 190, cardHeight, 3, 3, "F");

      doc.text(`ID: ${project_id?.toString() || "N/A"}`, 14, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Project Name:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(project_name || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Project Type:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(project_type || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Status:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(status || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Total Units:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(total_units?.toString() || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Available Units:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(available_units?.toString() || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Launch Date:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(launch_date || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Completion Date:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(completion_date || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Price Range:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(price_range || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Price Range SQ:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(price_range_SQ || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Description:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(
        doc.splitTextToSize(description || "N/A", 180),
        14,
        yPos + lineSpacing,
      );
      yPos += lineSpacing * 3.5;

      doc.setFont("helvetica", "bold");
      doc.text(`Location Map:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(location?.google_map_link || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      yPos += cardMargin;
    },
  );

  doc.save("Projects_Report.pdf");
};

export const projectsExportToExcel = (data: any[]) => {
  const formattedData = data.map(
    ({
      project_id,
      project_name,
      project_type,
      total_units,
      available_units,
      status,
      launch_date,
      completion_date,
      price_range,
      price_range_SQ,
      description,
      location,
    }: any) => ({
      ID: project_id ?? "N/A",
      "Project Name": project_name ?? "N/A",
      "Project Type": project_type ?? "N/A",
      "Available Units": available_units ?? "N/A",
      "Total Units": total_units ?? "N/A",
      Status: status ?? "N/A",
      "Launch Date": launch_date ?? "N/A",
      "Completion Date": completion_date ?? "N/A",
      "Price Range": price_range ?? "N/A",
      "Price Range SQ": price_range_SQ ?? "N/A",
      Description: description ?? "N/A",
      "Location Map": location?.google_map_link ?? "N/A",
    }),
  );

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  const header = Object.keys(formattedData[0] || {});
  const columnWidths = header.map((h) => ({
    wch:
      Math.max(
        h.length,
        ...formattedData.map((row: any) => row[h]?.toString().length || 10),
      ) + 2,
  }));
  worksheet["!cols"] = columnWidths;
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  XLSX.utils.book_append_sheet(workbook, worksheet, "Projects");
  XLSX.writeFile(workbook, "Projects_Report.xlsx");
};

// Projects Template
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

  // Create an empty worksheet with just the headers
  const worksheet = XLSX.utils.aoa_to_sheet([headers]);

  // Set the column widths based on header text length + padding
  const columnWidths = headers.map((header) => ({
    wch: header.length + 5, // Adding some padding for better display
  }));

  worksheet["!cols"] = columnWidths;

  // Freeze the header row
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  // Create a new workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

  // Write the file
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

  // Create an empty worksheet with just the headers
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  // Set the column widths based on header text length + padding
  const columnWidths = headers.map((header) => ({
    wch: header.length + 5, // Adding some padding for better display
  }));

  worksheet["!cols"] = columnWidths;

  // Freeze the header row
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  // Create a new workbook and add the worksheet
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Properties");

  // Write the file
  XLSX.writeFile(workbook, `${projectName}_Properties_Template.xlsx`);
};

export const activityExportToExcel = (data: any[]) => {
  const formattedData = data.map(
    (item: any) => ({
      ID: item.id ?? "N/A",
      User: item.user_name ?? "N/A",
      Action: item.action ?? "N/A",
      "Entity Type": item.entity_type ?? "N/A",
      "IP Address": item.ip_address ?? "N/A",
      "Date & Time": item.created_at ?? "N/A",
    }),
  );

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  const header = Object.keys(formattedData[0] || {});
  const columnWidths = header.map((h) => ({
    wch:
      Math.max(
        h.length,
        ...formattedData.map((row: any) => row[h]?.toString().length || 10),
      ) + 2,
  }));
  worksheet["!cols"] = columnWidths;
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  XLSX.utils.book_append_sheet(workbook, worksheet, "Activity Logs");
  XLSX.writeFile(workbook, "Activity_Logs.xlsx");
};

export const activityExportToPDF = (data: any[]) => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Activity Logs Report", 14, 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  let yPos = 25;
  const lineSpacing = 7;
  const cardMargin = 20;
  const pageHeight = doc.internal.pageSize.height;
  const valueXPos = 50;

  data.forEach(({ id, user_name, action, entity_type, ip_address, created_at }: any) => {
    if (yPos + 50 > pageHeight) {
      doc.addPage();
      yPos = 25;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`ID:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(id?.toString() || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`User:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(user_name || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Action:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(action || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Entity Type:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(entity_type || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`IP Address:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(ip_address || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Date & Time:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(created_at || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    yPos += cardMargin;
  });

  doc.save("Activity_Logs_Report.pdf");
};

// Locations
export const locationsExportToPDF = (data: any[]) => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Locations Report", 14, 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  let yPos = 25;
  const lineSpacing = 7;
  const cardMargin = 18;
  const pageHeight = doc.internal.pageSize.height;
  const valueXPos = 55;

  data.forEach(({ location_landmark, city_name, area_name, country_name, projects_count, created_at }: any) => {
    if (yPos + 60 > pageHeight) {
      doc.addPage();
      yPos = 25;
    }

    doc.setFont("helvetica", "bold");
    doc.text("Landmark:", 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(String(location_landmark || "N/A"), valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text("City:", 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(String(city_name || "N/A"), valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text("Area:", 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(String(area_name || "N/A"), valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text("Country:", 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(String(country_name || "N/A"), valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text("Projects:", 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(String(projects_count ?? 0), valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text("Created At:", 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(String(created_at || "N/A"), valueXPos, yPos);
    yPos += lineSpacing;

    yPos += cardMargin;
  });

  doc.save("Locations_Report.pdf");
};

export const locationsExportToExcel = (data: any[]) => {
  const formattedData = data.map(({ location_landmark, city_name, area_name, country_name, projects_count, created_at }: any) => ({
    Landmark: location_landmark ?? "N/A",
    City: city_name ?? "N/A",
    Area: area_name ?? "N/A",
    Country: country_name ?? "N/A",
    "Projects Count": projects_count ?? 0,
    "Created At": created_at ?? "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Locations");
  XLSX.writeFile(workbook, "Locations_Report.xlsx");
};

export const bookingsExportToExcel = (data: any[]) => {
  const formattedData = data.map((item: any) => ({
    ID: item.id ?? "N/A",
    Name: item.name ?? "N/A",
    Property: item.property ?? "N/A",
    Unit: item.unit ?? "N/A",
    Amount: item.amount ?? "N/A",
    Status: item.status ?? "N/A",
    "Last Updated": item.lastUpdated ?? "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Bookings");
  XLSX.writeFile(workbook, "Bookings_Report.xlsx");
};
