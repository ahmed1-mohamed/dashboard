import jsPDF from "jspdf";
import * as XLSX from "xlsx";

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
