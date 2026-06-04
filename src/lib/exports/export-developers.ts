import jsPDF from "jspdf";
import * as XLSX from "xlsx";

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
