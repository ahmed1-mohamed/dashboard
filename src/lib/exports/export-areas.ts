import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export const areasExportToExcel = (data: any[]) => {
  const formattedData = data.map((item: any) => ({
    ID: item.area_id ?? "N/A",
    "Area Name": item.area_name ?? "N/A",
    Region: item.region ?? "N/A",
    Population: item.population ?? 0,
    "Major Landmarks": item.major_landmarks?.join(", ") ?? "N/A",
    Created: item.created_at ?? "N/A",
    Status: item.status ? "Active" : "Inactive",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  const header = Object.keys(formattedData[0] || {});
  const columnWidths = header.map((h) => ({
    wch: Math.max(h.length, ...formattedData.map((row: any) => row[h]?.toString().length || 10)) + 2,
  }));
  worksheet["!cols"] = columnWidths;
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  XLSX.utils.book_append_sheet(workbook, worksheet, "Areas");
  XLSX.writeFile(workbook, "Areas_Report.xlsx");
};

export const areasExportToPDF = (data: any[]) => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Areas Report", 14, 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  let yPos = 25;
  const lineSpacing = 7;
  const cardMargin = 15;
  const pageHeight = doc.internal.pageSize.height;
  const valueXPos = 50;

  data.forEach(({ area_id, area_name, region, population, major_landmarks, created_at, status }: any) => {
    if (yPos + 50 > pageHeight) {
      doc.addPage();
      yPos = 25;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`ID:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(area_id?.toString() || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Area Name:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(area_name || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Region:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(region || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Population:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(population?.toString() || "0", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Landmarks:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(major_landmarks?.join(", ") || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Status:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(status ? "Active" : "Inactive", valueXPos, yPos);
    yPos += lineSpacing;

    yPos += cardMargin;
  });

  doc.save("Areas_Report.pdf");
};
