import * as XLSX from 'xlsx';

/**
 * Used to generate CSV and Excel files.
 *
 * @param {Object} data - The object you wish to convert to csv/excel
 * @param {String} fileName - Optional parameter to set custom file names.
 * @returns CSV/Excel File - Automatically downloads the related file.
 *
 * @example
 * // Export to CSV
 * ExportClass.exportToCSV(properties, `properties_export_${formattedDate}.csv`);
 * // Export to Excel
 * ExportClass.exportToExcel(properties, `properties_export_${formattedDate}.xlsx`);
 */
class ExportClass {
  static exportToCSV(data, fileName = 'data.csv') {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csvOutput = XLSX.utils.sheet_to_csv(worksheet);

    // Create a Blob from the CSV output
    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    // Create an anchor element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.style.display = 'none'; // Optional: hide the anchor element
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Release the object URL
    URL.revokeObjectURL(url);
  }

  static exportToExcel(data, fileName = 'data.xlsx') {
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    // Trigger the download automatically
    XLSX.writeFile(workbook, fileName);
  }
}

export default ExportClass;
