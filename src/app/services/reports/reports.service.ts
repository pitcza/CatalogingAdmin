import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header/header.service';
import { apiUrl } from '../../../config/url';
import { Workbook } from 'exceljs';
import Swal from 'sweetalert2';

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

  async exportToExcel(data: any[], fileName: string) {
    // Create a workbook and add a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report Sheet');

    // Add headers
    const headers = Object.keys(data[0]);

    if (!this.setupPage(workbook, worksheet, headers)) {
      Swal.fire({
        title: 'Error',
        text: "Error processing request, kindly contact the developers",
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: "#777777",
        scrollbarPadding: false,
        willOpen: () => {
          document.body.style.overflowY = 'scroll';
        },
        willClose: () => {
          document.body.style.overflowY = 'scroll';
        }
      });
      return
    };

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

  private setupPage(workbook: any, worksheet: any, headers: any) {
    worksheet.pageSetup.paperSize = 9; // A4 paper size
    worksheet.pageSetup.orientation = 'landscape'; // Landscape orientation
    worksheet.pageSetup.horizontalCentered = true; // Center horizontally
    worksheet.pageSetup.verticalCentered = true; // Center vertically

    const num = headers.length;
    if (num < 1 || num > 26) {
        return false;
    }

    const letter = String.fromCharCode(64 + num);
    const cellMerge = 'A1:' + letter + '1';
    worksheet.mergeCells(cellMerge);
    const cell = worksheet.getCell('A1');
    cell.value = {
        richText: [
            { text: 'Republic of the Philippines', font: { size: 12 } },
            { text: '\nCity of Olongapo', font: { size: 12 } },
            { text: '\nGORDON COLLEGE', font: { bold: true, size: 12 } },
            { text: '\nOlongapo City Sports Complex, Donor St., East Tapinac, Olongapo City', font: { size: 10 } },
            { text: '\nTel. No.: (047) 224-2089 loc. 401', font: { size: 10 } },
            { text: '\n\nLIBRARY AND INSTRUCTIONAL MEDIA CENTER', font: { bold: true, size: 12 } },
        ]
    };

    cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true
    };

    worksheet.getRow(1).height = 150;

    this.fetchImageAsBlob('GC-LIBRARY.png').subscribe((blob) => {
        // Convert the blob to a base64 string
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = async () => {
            const base64data = reader.result as string;

            console.log(base64data)
            // Add the image to the workbook
            const imageId = workbook.addImage({
                base64: base64data.split(',')[1], // Remove the data URL prefix
                extension: 'png', // Ensure the correct extension
            });

            // Add the image to the worksheet
            worksheet.addImage(imageId, {
                tl: { col: 6, row: 1 },
                ext: { width: 500, height: 200 }
            });
        };
    });

    return true;
}


  fetchImageAsBlob(imagePath: string) {
    return this.http.get(`assets/images/${imagePath}`, { responseType: 'blob' });
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