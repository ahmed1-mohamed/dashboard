import * as XLSX from "xlsx";

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
