import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export const featuresExportToExcel = (data: any[]) => {
  const formattedData = data.map((item: any) => ({
    ID: item.id ?? "N/A",
    "Feature Name": item.featureName ?? "N/A",
    "Is Amenity": item.isAmenity ? "Yes" : "No",
    Icon: item.icon ?? "N/A",
  }));

  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();

  const header = Object.keys(formattedData[0] || {});
  const columnWidths = header.map((h) => ({
    wch: Math.max(h.length, ...formattedData.map((row: any) => row[h]?.toString().length || 10)) + 2,
  }));
  worksheet["!cols"] = columnWidths;
  worksheet["!freeze"] = { xSplit: 0, ySplit: 1 };

  XLSX.utils.book_append_sheet(workbook, worksheet, "Features");
  XLSX.writeFile(workbook, "Features_Report.xlsx");
};

export const featuresExportToPDF = (data: any[]) => {
  const doc = new jsPDF();
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Features Report", 14, 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  let yPos = 25;
  const lineSpacing = 7;
  const cardMargin = 15;
  const pageHeight = doc.internal.pageSize.height;
  const valueXPos = 50;

  data.forEach(({ id, featureName, isAmenity, icon }: any) => {
    if (yPos + 40 > pageHeight) {
      doc.addPage();
      yPos = 25;
    }

    doc.setFont("helvetica", "bold");
    doc.text(`ID:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(id?.toString() || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Feature Name:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(featureName || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Is Amenity:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(isAmenity ? "Yes" : "No", valueXPos, yPos);
    yPos += lineSpacing;

    doc.setFont("helvetica", "bold");
    doc.text(`Icon:`, 14, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(icon || "N/A", valueXPos, yPos);
    yPos += lineSpacing;

    yPos += cardMargin;
  });

  doc.save("Features_Report.pdf");
};
