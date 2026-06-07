import jsPDF from "jspdf";
import * as XLSX from "xlsx";

export const adsExportToPDF = (data: any[]) => {
  const doc = new jsPDF();

  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text("Ads Report", 14, 10);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");

  let yPos = 25;
  const lineSpacing = 7;
  const cardMargin = 20;
  const pageHeight = doc.internal.pageSize.height;
  const valueXPos = 50;

  data.forEach(
    ({
      creative_id,
      creative_title,
      type,
      platform,
      country,
      location,
      views,
      clicks,
      ctr,
      status,
      created_at,
    }: any) => {
      const cardHeight = 90;

      if (yPos + cardHeight > pageHeight) {
        doc.addPage();
        yPos = 25;
      }

      doc.setFillColor(240, 240, 240);
      doc.roundedRect(10, yPos - 4, 190, cardHeight, 3, 3, "F");

      doc.text(`ID: ${creative_id?.toString() || "N/A"}`, 14, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Title:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(creative_title || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Type:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(type || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Platform:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(platform || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Status:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(status || "N/A", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Views:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(views?.toLocaleString() || "0", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Clicks:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(clicks?.toLocaleString() || "0", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`CTR:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(ctr?.toString() || "0%", valueXPos, yPos);
      yPos += lineSpacing;

      doc.setFont("helvetica", "bold");
      doc.text(`Location:`, 14, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${location || "N/A"}, ${country || "N/A"}`, valueXPos, yPos);
      yPos += lineSpacing;

      yPos += cardMargin;
    },
  );

  doc.save("Ads_Report.pdf");
};

export const adsExportToExcel = (data: any[]) => {
  const formattedData = data.map(
    ({
      creative_id,
      creative_title,
      type,
      platform,
      country,
      location,
      views,
      clicks,
      ctr,
      status,
      created_at,
    }: any) => ({
      "Ad ID": creative_id ?? "N/A",
      "Title": creative_title ?? "N/A",
      "Type": type ?? "N/A",
      "Platform": platform ?? "N/A",
      "Country": country ?? "N/A",
      "Location": location ?? "N/A",
      "Views": views ?? 0,
      "Clicks": clicks ?? 0,
      "CTR": ctr ?? "0%",
      "Status": status ?? "N/A",
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

  XLSX.utils.book_append_sheet(workbook, worksheet, "Ads");
  XLSX.writeFile(workbook, "Ads_Report.xlsx");
};
