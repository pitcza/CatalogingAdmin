import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../../header.service';
import { apiUrl } from '../../../../config/url';
import { Workbook, CellRichTextValue, Font, RichText } from 'exceljs';


@Injectable({
  providedIn: 'root'
})
export class ReportsService {

  constructor(
    private http: HttpClient,
    private headers: HeaderService
  ) { }

  url = apiUrl + 'reports/';
  data: any;

  public getMaterialCounts() {
    return this.http.get(this.url + 'material-counts', { headers: this.headers.get() });
  }

  public mapData(data: any) {
    this.data = data;
  }

  // public async exportToExcel(data: any[], fileName: string){
  //   const workbook = new Workbook();
  //   const worksheet = workbook.addWorksheet('Sheet1');

  //   // Process the data to format authors as a comma-separated string
  //   data.forEach((x: any) => {
  //     let authors = '';
  //     if (x.authors) {
  //       x.authors.forEach((author: any) => {
  //         authors += author + ', ';
  //       });
  //     }

  //     if(authors.length > 0) x.authors = authors.substring(0, authors.length - 2);
  //     else x.authors = authors;
  //   });

  //   // Add the JSON data to the worksheet
  //   worksheet.columns = Object.keys(data[0]).map(key => ({ header: key, key: key }));

  //   data.forEach(item => {
  //     worksheet.addRow(item);
  //   });

  //   // Define cell styles
  //   const cellStyle: Partial<Alignment> = {
  //     vertical: 'middle',
  //     horizontal: 'center',
  //   };

  //   const borderStyle: Partial<Borders> = {
  //     top: { style: 'thin' },
  //     bottom: { style: 'thin' },
  //     left: { style: 'thin' },
  //     right: { style: 'thin' },
  //   };

  //   // Apply styles to each cell in the worksheet
  //   worksheet.eachRow((row, rowNumber) => {
  //     row.eachCell((cell, colNumber) => {
  //       cell.alignment = cellStyle;
  //       cell.border = borderStyle;
  //     });
  //   });

  //   // Write the workbook to a file
  //   await workbook.xlsx.writeFile(`${fileName}.xlsx`);
  // }

  async exportToExcel(data: any[], fileName: string) {
    // Create a workbook and add a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report Sheet');

    this.setupPage(worksheet, 'A1');

    // Add headers
    const headers = Object.keys(data[0]);

    let formattedHeaders = [];
    for (let i = 0; i < headers.length; i++) {
      formattedHeaders[i] = '';
      switch(headers[i]) {
        case 'acquired_date':
          formattedHeaders[i] = 'DATE RECEIVED';
          break;

        case 'authors':
          formattedHeaders[i] = 'AUTHOR/S';
          break;

        default:
          formattedHeaders[i] = headers[i].toUpperCase();
          break;
      }
    }

    const headerRow = worksheet.addRow(formattedHeaders);
    headerRow.height = 40;
    headerRow.eachCell((cell, colNumber) => {
      this.addHeaderStyle(cell);

      let header = cell.value;
      const column = worksheet.getColumn(colNumber);
      switch(header) {
        case 'ACCESSION':
          column.width = 15;
          break;

        case 'TITLE':
          column.width = 30;
          break;

        case 'AUTHOR/S':
          column.width = 25;
          break;

        case 'COPYRIGHT':
          column.width = 15;
          break;

        case 'LOCATION':
          column.width = 15;
          break;
      }
    });

    // Add data
    data.forEach((item) => {
      const row:any = [];
      headers.forEach((header) => {
        if(header == 'authors') {
          let authors = '';
          if(item[header]) {
            item[header].forEach((x: any, index: number) => {
              authors += x;
              if (index < item[header].length - 1) authors += ', ';
              else authors += '';
            });
          }
          row.push(authors.substring(0, authors.length - 2));
        } else row.push(item[header]);
      });
      let addedRow = worksheet.addRow(row);
      addedRow.eachCell((cell) => {
        this.addCellStyle(cell);
      });
    });

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    this.saveExcel(buffer, fileName);
  }

  private addHeaderStyle(cell: any) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4F6F52' } // Green color
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thick' },
      right: { style: 'thin' }
    };
    cell.font = {
      color: { argb: 'FFFFFF' }, // White font color
      size: 11,
      bold: true
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center'
    };
  }

  private addCellStyle(cell: any) {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
    cell.font = {
      size: 11
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'left',
      wrapText: true
    };
  }

  private setupPage(worksheet: any, cell: any) {
    worksheet.pageSetup.paperSize = 9; // A4 paper size
    worksheet.pageSetup.orientation = 'landscape'; // Landscape orientation
    worksheet.pageSetup.horizontalCentered = true; // Center horizontally
    worksheet.pageSetup.verticalCentered = true; // Center vertically

  }

  private saveExcel(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}

    // const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);
    //  // Define cell styles
    //  const cellStyle = {
    //   alignment: { vertical: 'center', horizontal: 'center' },
    //   border: {
    //     top: { style: 'thin' },
    //     bottom: { style: 'thin' },
    //     left: { style: 'thin' },
    //     right: { style: 'thin' }
    //   }
    // };

    // // Apply styles to each cell in the worksheet
    // if (ws['!ref']) {
    //   const range = XLSX.utils.decode_range(ws['!ref']);
    //   // Apply styles to each cell in the worksheet
    //   for (let R = range.s.r; R <= range.e.r; ++R) {
    //     for (let C = range.s.c; C <= range.e.c; ++C) {
    //       const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
    //       if (!ws[cellAddress]) ws[cellAddress] = { t: 's', v: '' }; // Create cell if it doesn't exist
    //       ws[cellAddress].s = cellStyle; // Assign style to cell
    //     }
    //   }
    // }

    // const wb: XLSX.WorkBook = XLSX.utils.book_new();
    // XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

    // XLSX.writeFile(wb, `${fileName}.xlsx`);
//   }
// }
