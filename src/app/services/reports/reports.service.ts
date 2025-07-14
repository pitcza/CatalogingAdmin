import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeaderService } from '../header/header.service';
import { Workbook } from 'exceljs';
import Swal from 'sweetalert2';
import { appSettings } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  constructor(
    private http: HttpClient,
    private headers: HeaderService,
  ) {}

  url = appSettings.apiUrlSystem + 'reports/';
  data: any;

  public getMaterialCounts() {
    return this.http.get(this.url + 'material-counts', {
      headers: this.headers.get(),
    });
  }

  public mapData(data: any) {
    this.data = data;
  }

  async exportToExcel(data: any[], fileName: string) {
    if (!data || data.length == 0) {
      Swal.fire({
        title: 'Error exporting report',
        text: 'No data available',
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: '#777777',
        scrollbarPadding: false,
      });

      return;
    }
    // Create a workbook and add a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Report Sheet');

    // Headers to be removed
    let removeHeaders: any = ['created_at'];

    if (fileName == 'Cataloging Academic Projects Report')
      var headers = [
        'project_program',
        'category',
        'title',
        'authors',
        'date_published',
      ];
    else if (fileName.toLowerCase().includes('project'))
      var headers = ['category', 'authors', 'title', 'date_published'];
    else
      var headers = Object.keys(data[0]).filter(
        (key) => !removeHeaders.includes(key),
      );

    // Setup header and page
    if (!(await this.setupPage(workbook, worksheet, headers, removeHeaders))) {
      Swal.fire({
        title: 'Error',
        text: 'Error processing request, kindly contact the developers',
        icon: 'error',
        confirmButtonText: 'Close',
        confirmButtonColor: '#777777',
        scrollbarPadding: false,
        willOpen: () => {
          document.body.style.overflowY = 'scroll';
        },
        willClose: () => {
          document.body.style.overflowY = 'scroll';
        },
      });
      return;
    }

    // Fix header format
    let formattedHeaders = [];
    for (let i = 0; i < headers.length; i++) {
      formattedHeaders[i] = '';
      switch (headers[i]) {
        case 'acquired_date':
          formattedHeaders[i] = 'DATE RECEIVED';
          break;

        case 'date_published':
          formattedHeaders[i] = 'DATE PUBLISHED';
          break;

        case 'authors':
          formattedHeaders[i] = 'AUTHOR/S';
          break;

        case 'project_program':
          formattedHeaders[i] = 'DEPARTMENT';
          break;

        default:
          formattedHeaders[i] = headers[i].toUpperCase();
          break;
      }
    }

    // Fix cell sizing
    const headerRow = worksheet.addRow(formattedHeaders);
    var leftCells: any = [];
    headerRow.height = 40;
    headerRow.eachCell((cell, colNumber) => {
      this.addHeaderStyle(cell);

      let header = cell.value;
      const column = worksheet.getColumn(colNumber);
      switch (header) {
        case 'TITLE':
          column.width = 40;
          leftCells.push(colNumber);
          break;

        case 'AUTHOR/S':
          column.width = 40;
          leftCells.push(colNumber);
          break;

        case 'PUBLISHER':
          column.width = 30;
          break;

        default:
          column.width = 20;
          break;
      }
    });

    // Add data
    data.forEach((item) => {
      const row: any = [];
      headers.forEach((header) => {
        if (header == 'authors') {
          let authors = '';
          if (item[header]) {
            item[header].forEach((x: any, index: number) => {
              authors += x;
              if (index < item[header].length - 1) authors += ', \n';
              else authors += '';
            });
          }
          row.push(authors.substring(0, authors.length - 2));
        } else if (header == 'acquired_date' || header == 'date_published') {
          const date = new Date(item[header]);

          // Custom formatting: "Jan 20, 2024"
          const options: Intl.DateTimeFormatOptions = {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          };
          const formattedDate = new Intl.DateTimeFormat(
            'en-US',
            options,
          ).format(date);

          row.push(formattedDate);
        } else if (header == 'project_program') {
          // let project_program = JSON.parse(item[header]);
          row.push(item[header].department_short);
        } else row.push(item[header]);
      });
      let addedRow = worksheet.addRow(row);
      addedRow.eachCell((cell, colNumber) => {
        if (leftCells.includes(colNumber)) this.addCellStyle(cell, 'left');
        else this.addCellStyle(cell, 'center');
      });
    });

    worksheet.addRow('');
    worksheet.addRow(['Total Count', data.length]);

    // Generate Excel file
    const buffer = await workbook.xlsx.writeBuffer();
    this.saveExcel(buffer, fileName);
  }

  private addHeaderStyle(cell: any) {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: '4F6F52' }, // Green color
    };
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thick' },
      right: { style: 'thin' },
    };
    cell.font = {
      color: { argb: 'FFFFFF' }, // White font color
      size: 11,
      bold: true,
    };
    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
    };
  }

  private addCellStyle(cell: any, type: string) {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' },
    };
    cell.font = {
      size: 11,
    };

    if (type != 'left') {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'center',
        wrapText: true,
      };
    } else {
      cell.alignment = {
        vertical: 'middle',
        horizontal: 'left',
        wrapText: true,
      };
    }
  }

  private async setupPage(
    workbook: any,
    worksheet: any,
    headers: any,
    removeHeaders: any,
  ) {
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
        {
          text: '\nOlongapo City Sports Complex, Donor St., East Tapinac, Olongapo City',
          font: { size: 10 },
        },
        { text: '\nTel. No.: (047) 224-2089 loc. 401', font: { size: 10 } },
        {
          text: '\n\nLIBRARY AND INSTRUCTIONAL MEDIA CENTER',
          font: { bold: true, size: 12 },
        },
      ],
    };

    cell.alignment = {
      vertical: 'middle',
      horizontal: 'center',
      wrapText: true,
    };

    worksheet.getRow(1).height = 150;

    try {
      // Load image as base64-encoded string
      const GCLibraryImage = await this.loadBase64Image(
        'assets/images/GC-LIBRARY.png',
      );
      const GCImage = await this.loadBase64Image('assets/images/GC.png');

      // Add image to workbook
      const addLogo1 = await workbook.addImage({
        base64: GCLibraryImage,
        extension: 'png',
      });

      // Add the image to the worksheet
      worksheet.addImage(addLogo1, {
        tl: { col: 0.2, row: 0.2 },
        ext: { width: 120, height: 120 },
      });

      // Add image to workbook
      const addLogo2 = await workbook.addImage({
        base64: GCImage,
        extension: 'png',
      });

      // Add the image to the worksheet
      if (headers.includes('department')) {
        worksheet.addImage(addLogo2, {
          tl: { col: headers.length + 0.2, row: 0.2 }, // Adjust col and row according to your requirement
          ext: { width: 120, height: 120 },
        });
      } else {
        worksheet.addImage(addLogo2, {
          tl: { col: headers.length - removeHeaders.length + 0.2, row: 0.2 }, // Adjust col and row according to your requirement
          ext: { width: 120, height: 120 },
        });
      }

      return true; // Indicate success
    } catch (error) {
      console.error('Error adding image:', error);
      return false; // Indicate failure
    }
  }

  fetchImageAsBlob(imagePath: string) {
    return this.http.get(`assets/images/${imagePath}`, {
      responseType: 'blob',
    });
  }

  private async loadBase64Image(imagePath: string): Promise<string> {
    try {
      const imageBlob = await this.http
        .get(imagePath, { responseType: 'blob' })
        .toPromise();
      const reader = new FileReader();
      return new Promise<string>((resolve, reject) => {
        reader.onloadend = () => {
          resolve(reader.result as string);
        };
        reader.onerror = reject;
        if (imageBlob) reader.readAsDataURL(imageBlob);
      });
    } catch (error) {
      console.error('Error loading image:', error);
      throw error;
    }
  }

  private saveExcel(buffer: any, fileName: string) {
    const data: Blob = new Blob([buffer], {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });
    const url = window.URL.createObjectURL(data);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();
  }
}
