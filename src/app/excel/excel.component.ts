import { Component, ViewChild } from '@angular/core';
import { ExcelService } from '../_Services/excel.service';
import Handsontable from 'handsontable';
import HyperFormula from 'hyperformula';
import { DropDownsData } from '../_models/DropDownsData';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { SpinnerService } from '../_Services/spinner.service';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css'],
})
export class ExcelComponent {
  @ViewChild('rollUp') rollUp!: MatSelect;
  excelData: any;
  dropdownData: any;
  ddnDataSource: any = [];
  ddnCategory: any = [];
  ddnBrands: any = [];
  ddnYears: any = [];
  ddnrollUps: string[] = ['Quarter MAT', 'Half MAT', 'Full Year'];
  ddnMeasure: any[] = ['$ Sales CATEGORY', '% Chg CATEGORY', '$ Sales UNILEVER', '% Chg UNILEVER', 'UL $ Share'];
  hotInstance!: Handsontable;

  dropDownForm = this._FormBuilder.group({
    Brands: new FormControl({ value: ['all'], disabled: false }),
    subCategory: new FormControl({ value: ['all'], disabled: false }),
    DataSource: new FormControl({ value: ['all'], disabled: false }),
    Years: new FormControl({ value: ['all'], disabled: false }, [Validators.required]),
    rollup: new FormControl({ value: ['all'], disabled: false }),
    Measure: new FormControl({ value: 'all', disabled: false }, [Validators.required]),
  });

  constructor(
    private excelService: ExcelService,
    private _FormBuilder: FormBuilder,
    private loader: SpinnerService
  ) { }

  ngOnInit(): void {
    this.loader.showSpinner();
    this.getDropdowndata().then(() => {
      this.loader.hideSpinner();
    });
    Handsontable.renderers.registerRenderer('negativeValueRenderer', this.negativeValueRenderer);

  }

  hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  });

  getsubCategory() {
    this.excelService.getsubCategory().subscribe((category) => {
      return category;
    });
  }

  async getData(value: any) {
    this.loader.showSpinner();
    console.log('Excel ', value);
    try {
      const data = await this.bindData(value);
      this.loader.hideSpinner();
      return data;
    } catch (error) {
      this.loader.hideSpinner();
      throw error;
    }
  }

  async getSummaryData() {
    return new Promise((resolve, reject) => {
      this.excelService.SummaryData().subscribe({
        next: (response) => {
          console.log(response);
          resolve(response);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
  async getSummaryDataByBrand(dropdownData: any) {
    return new Promise((resolve, reject) => {
      this.excelService.SummaryDataByFilters(dropdownData).subscribe({
        next: (response) => {
          console.log(response);
          resolve(response);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  async getTemplateData() {
    return new Promise((resolve, reject) => {
      this.excelService.getTemplateData().subscribe({
        next: (response) => {
          console.log('getTemplateData', response);
          resolve(response);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  async bindData(data: any) {
    const container1 = document.querySelector('#example-basic-multi-sheet-1');
    try {
      // const res = await this.getSummaryData();
      let res: any = await this.getTemplateData();
      console.log("BindData_Data", res[0])
      this.excelData = res;
      if (container1) {
        container1.innerHTML = '';
        this.hotInstance = new Handsontable(container1, {
          data: res,
          colHeaders: false,
          rowHeaders: false,
          width: '100%',
          height: 'auto',
          formulas: {
            engine: this.hyperformulaInstance,
          },
          // mergeCells:res.mergeData,
          licenseKey: 'non-commercial-and-evaluation',
          hiddenColumns: {
            columns: [16],
            indicators: true,
          },

          mergeCells: [
            { row: 1, col: 1, rowspan: 3, colspan: 1 },
            { row: 5, col: 1, rowspan: 3, colspan: 1 },
            { row: 9, col: 1, rowspan: 3, colspan: 1 },
            { row: 13, col: 1, rowspan: 3, colspan: 1 },
            { row: 17, col: 1, rowspan: 9, colspan: 1 },
            { row: 27, col: 1, rowspan: 3, colspan: 1 },
            { row: 31, col: 1, rowspan: 3, colspan: 1 },
            { row: 35, col: 1, rowspan: 3, colspan: 1 },
            { row: 39, col: 1, rowspan: 3, colspan: 1 },
            { row: 43, col: 1, rowspan: 9, colspan: 1 },
            { row: 53, col: 1, rowspan: 3, colspan: 1 },
            { row: 57, col: 1, rowspan: 3, colspan: 1 },
            { row: 61, col: 1, rowspan: 3, colspan: 1 },
            { row: 65, col: 1, rowspan: 3, colspan: 1 },
            { row: 69, col: 1, rowspan: 9, colspan: 1 },
            { row: 0, col: 0, rowspan: 4, colspan: 1 },
            { row: 4, col: 0, rowspan: 4, colspan: 1 },
            { row: 8, col: 0, rowspan: 4, colspan: 1 },
            { row: 12, col: 0, rowspan: 4, colspan: 1 },
            { row: 16, col: 0, rowspan: 10, colspan: 1 },
            { row: 26, col: 0, rowspan: 4, colspan: 1 },
            { row: 30, col: 0, rowspan: 4, colspan: 1 },
            { row: 34, col: 0, rowspan: 4, colspan: 1 },
            { row: 38, col: 0, rowspan: 4, colspan: 1 },
            { row: 42, col: 0, rowspan: 10, colspan: 1 },
          ],
          cells: (row: any, col: any, prop: any, ...args: any[]) => { // Use rest parameters syntax
            const cellProperties: any = {};
            if ([0, 4, 8, 12, 16, 26, 30, 34,38,42,52,56,60,64,68,78,82,86,90,94,98].includes(row)) {
              cellProperties.renderer = this.firstRowRenderer.bind(this, ...args); // Bind the renderer function with arguments
            }
            else {
              cellProperties.renderer = 'negativeValueRenderer'; // uses lookup map 
            }
            return cellProperties;
          }
          // customBorders: [
          //   {
          //     range: { from: { row: 0, col: 0 }, to: { row: 3, col: 15 } },
          //     top: { width: 1, color: '#333333' },
          //     left: { width: 1, color: '#333333' },
          //     right: { width: 1, color: '#333333' },
          //     bottom: { width: 1, color: '#333333' }
          //   },
          //   {
          //     range: { from: { row: 15, col: 0 }, to: { row: 17, col: 15 } },
          //     top: { width: 1, color: '#333333' },
          //     left: { width: 1, color: '#333333' },
          //     right: { width: 1, color: '#333333' },
          //     bottom: { width: 1, color: '#333333' }
          //   },
          //   {
          //     range: { from: { row: 19, col: 0 }, to: { row: 28, col: 15 } },
          //     top: { width: 1, color: '#333333' },
          //     left: { width: 1, color: '#333333' },
          //     right: { width: 1, color: '#333333' },
          //     bottom: { width: 1, color: '#333333' }
          //   }
          // ] 

        });
      }
    } catch (error) {
      console.error('error:', error);
    }
  };


  firstRowRenderer = (instance: any, td: any, row: any, col: any, prop: any, value: any, cellProperties: any) => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]); // Use apply with an array of arguments
    td.style.fontWeight = 'bold';
    td.style.color = 'white';
    td.style.background = '#305496';
  }
  negativeValueRenderer = (instance: any, td: any, row: number, col: number, prop: string | number, value: any, cellProperties: any) => {
    Handsontable.renderers.TextRenderer.apply(this, [instance, td, row, col, prop, value, cellProperties]);
    const columnHeader = instance.getDataAtCell(row, 2); // Assuming the column header is in the 3rd row (index 2)
    if (col > 3 && ["UL BPS Chg", "$ % Chg","Proj $ % Chg","Proj BPS Chg"].includes(columnHeader) && !isNaN(parseFloat(value))) {
      console.log(parseFloat(value));
      const isNegative = parseFloat(value) < 0; 
      console.log('isNegative',isNegative)
      td.className = isNegative ? 'make-me-red' : 'make-me-green';
      td.style.background = isNegative ? '#ffc7ce' : '#c6efce';
      td.style.fontWeight = 'bold';
    }
      
  };


  async getDropdowndata() {
    return new Promise((resolve, reject) => {
      this.excelService.dropdowndata().subscribe({
        next: (response: DropDownsData) => {
          this.ddnBrands = response.brands;
          this.ddnCategory = response.subCategories;
          this.ddnDataSource = response.sources;
          this.ddnYears = response.years;
          console.log(response);
          resolve(response);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }

  uploadData() {
    let data = this.hotInstance.getData();
    console.log('UploadData', data)
    console.log('UploadData1', this.hotInstance.getColHeader())
    return new Promise((resolve, reject) => {
      this.excelService.uploadExcelData(data).subscribe({
        next: (response) => {
          console.log('getTemplateData', response);
          alert(response)
          resolve(response);
        },
        error: (error) => {
          console.log("uploadData_error", error)
          alert("Something Went Wrong")
          reject(error);
        },
      });
    });
  }
}
