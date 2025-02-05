import { CommonModule } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import jspreadsheet, { CellValue } from "jspreadsheet-ce";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  imports: [CommonModule],
})
export class AppComponent implements AfterViewInit {
  title = 'myapp';
  jspreadsheetList: any;
  errorList: {
    y: number;
    x: number;
    error: string;
  }[] = [];

  ngAfterViewInit() {
    const elm:HTMLDivElement | null = document.querySelector("div#spreadsheet");
    if(elm){
      this.jspreadsheetList = jspreadsheet(elm, {
        data: [],
        columns: [
          {
            type: "text",
            title: "Nama Pengirim",
            width: 200,
            wordWrap: true,
          },
          {
            type: "text",
            title: "Telepon Pengirim",
            width: 200,
            wordWrap: true,
          },
          {
            type: "text",
            title: "Nama Barang",
            width: 200,
            wordWrap: true,
          },
          {
            type: "text",
            title: "Berat Barang",
            width: 200,
            wordWrap: true
          },
          {
            type: "text",
            title: "Nilai Barang",
            width: 200,
            wordWrap: true,
          },
        ],
        minDimensions: [5, 5], // Minimum 3 columns & 5 rows
        paginationOptions: [],
        contextMenu: undefined,
        allowInsertRow: false, // Allow adding rows
        allowInsertColumn: false, // Allow adding columns
        allowManualInsertRow: false,
        allowManualInsertColumn: false,
      });
    }
  }
  
  validateForm(){
    if(this.jspreadsheetList){
      const data:string[][] = this.jspreadsheetList.getData();
      this.errorList = [];
      data.forEach((rowData, rowIdx) => {
        const y = rowIdx;
        // hapus semua class invalid
        rowData.forEach((_, colIdx) => {
          const cell = document.querySelector(`#spreadsheet td[data-x="${colIdx}"][data-y="${rowIdx}"]`);
          if(cell && cell.classList.contains("invalid-cell")){
            cell.classList.remove("invalid-cell");
          }
        })
        if(rowData.some(colData => colData)){
          if(rowData.some(colData => !colData)){
            this.errorList.push({
              y: y,
              x: -1,
              error: `baris ke-${y+1} : Data tidak lengkap`
            });
            // tambah class invalid untuk 1 row
            const cells = document.querySelectorAll(`#spreadsheet td[data-y="${rowIdx}"]:not(.jexcel_row)`);
            cells.forEach(cell => {
              if(cell && !cell.classList.contains("invalid-cell")){
                cell.classList.add("invalid-cell");
              }
            })
          }else{
            rowData.forEach((colData, colIdx) => {
              const x = colIdx;
              if(x == 0){
                // Nama Pengirim max 50 karakter
                if(colData.length > 50){
                  this.errorList.push({
                    y: y,
                    x: x,
                    error: `baris ke-${y+1} : Nama Pengirim max 50 karakter`
                  });
                  this.setErrorOnSpreadSheet(x,y);
                }
              }
              if(x == 1){
                // Telepon Pengirim hanya boleh angka
                if(!/^\d+$/.test(colData)){
                  this.errorList.push({
                    y: y,
                    x: x,
                    error: `baris ke-${y+1} : Telepon Pengirim hanya boleh angka`
                  });
                  this.setErrorOnSpreadSheet(x,y);
                }
                // Telepon Pengirim min 10 karakter
                if(colData.length < 10){
                  this.errorList.push({
                    y: y,
                    x: x,
                    error: `baris ke-${y+1} : Telepon Pengirim min 10 karakter`
                  });
                  this.setErrorOnSpreadSheet(x,y);
                }
                // Telepon Pengirim max 15 karakter
                if(colData.length > 15){
                  this.errorList.push({
                    y: y,
                    x: x,
                    error: `baris ke-${y+1} : Telepon Pengirim max 15 karakter`
                  });
                  this.setErrorOnSpreadSheet(x,y);
                }
              }
              if(x == 2){
                // Nama Barang max 50 karaker
                if(colData.length > 50){
                  this.errorList.push({
                    y: y,
                    x: x,
                    error: `baris ke-${y+1} : Nama Barang max 50 karaker`
                  });
                  this.setErrorOnSpreadSheet(x,y);
                }
              }
              if(x == 3){
                // Berat Barang hanya boleh angka (tidak diawali dengan "0")
                if(!/^[1-9][0-9]*$/.test(colData)){
                  this.errorList.push({
                    y: y,
                    x: x,
                    error: `baris ke-${y+1} : Berat Barang hanya boleh angka (tidak diawali dengan \"0\")`
                  });
                  this.setErrorOnSpreadSheet(x,y);
                }
                // Berat Barang max 50.000 gram
                if(parseFloat(colData) > 50000){
                  this.errorList.push({
                    y: y,
                    x: x,
                    error: `baris ke-${y+1} : Berat Barang max 50.000 gram`
                  });
                  this.setErrorOnSpreadSheet(x,y);
                }
              }
              if(x == 4){
                // Nilai Barang hanya boleh angka (tidak diawali dengan "0")
                if(!/^[1-9][0-9]*$/.test(colData)){
                  this.errorList.push({
                    y: y,
                    x: x,
                    error: `baris ke-${y+1} : Nilai Barang hanya boleh angka (tidak diawali dengan \"0\")`
                  });
                  this.setErrorOnSpreadSheet(x,y);
                }
                // Nilai Barang max 5.000.000
                if(parseFloat(colData) > 5000000){
                  this.errorList.push({
                    y: y,
                    x: x,
                    error: `baris ke-${y+1} : Nilai Barang max 5.000.000`
                  });
                  this.setErrorOnSpreadSheet(x,y);
                }
              }
            })
          }
        }
      })      
    }
  }
  
  setErrorOnSpreadSheet(x: number, y: number){
    const cell = document.querySelector(`#spreadsheet td[data-x="${x}"][data-y="${y}"]`);
    if(cell && !cell.classList.contains("invalid-cell")){
      cell.classList.add("invalid-cell");
    }
  }
}
