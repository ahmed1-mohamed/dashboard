import jsPDF from "jspdf";
import * as XLSX from "xlsx";

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
      location_landmark,
      city_name,
      country_name,
    }: any) => {
      const cardHeight = 170;

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
      doc.text(`Location:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${location_landmark || "N/A"}, ${city_name || "N/A"}, ${country_name || "N/A"}`, valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Description:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      const cleanDesc = description ? description.replace(/<[^>]*>?/gm, "") : "N/A";
      doc.text(
        doc.splitTextToSize(cleanDesc, 180),
        14,
        yPos + lineSpacing,
      );
      yPos += lineSpacing * 3.5;

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
      project_size,
      phase,
      is_active,
      project_currency,
      permit_no,
      barcode,
      slug,
      properties_count,
      active_properties_count,
      available_properties_count,
      booked_properties_count,
      sold_properties_count,
      developer_name,
      city_name,
      country_name,
      country_currency,
      country_dimension_unit,
      location_landmark,
      created_at,
    }: any) => ({
      "Project ID": project_id ?? "N/A",
      "Project Name": project_name ?? "N/A",
      "Project Type": project_type ?? "N/A",
      "Developer": developer_name ?? "N/A",
      "Status": status ?? "N/A",
      "Is Active": is_active === 1 || is_active === true || is_active === "1" ? "Yes" : "No",
      "Total Units": total_units ?? "N/A",
      "Available Units": available_units ?? "N/A",
      "Properties Count": properties_count ?? 0,
      "Active Properties Count": active_properties_count ?? 0,
      "Available Properties Count": available_properties_count ?? 0,
      "Booked Properties Count": booked_properties_count ?? 0,
      "Sold Properties Count": sold_properties_count ?? 0,
      "Launch Date": launch_date ?? "N/A",
      "Completion Date": completion_date ?? "N/A",
      "Price Range": price_range ?? "N/A",
      "Price Range SQ": price_range_SQ ?? "N/A",
      "Project Currency": project_currency ?? "N/A",
      "Country Name": country_name ?? "N/A",
      "City Name": city_name ?? "N/A",
      "Location Landmark": location_landmark ?? "N/A",
      "Country Currency": country_currency ?? "N/A",
      "Country Dimension Unit": country_dimension_unit ?? "N/A",
      "Project Size": project_size ?? "N/A",
      "Description": description ? description.replace(/<[^>]*>?/gm, "") : "N/A",
      "Phase": phase ?? "N/A",
      "Permit No": permit_no ?? "N/A",
      "Barcode": barcode ?? "N/A",
      "Slug": slug ?? "N/A",
      "Created At": created_at ?? "N/A",
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
