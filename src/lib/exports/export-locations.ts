import jsPDF from "jspdf";
import * as XLSX from "xlsx";

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
