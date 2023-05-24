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
  ddnMeasure: any[] = [
    '$ Sales CATEGORY',
    '% Chg CATEGORY',
    '$ Sales UNILEVER',
    '% Chg UNILEVER',
    'UL $ Share',
  ];

  dropDownForm = this._FormBuilder.group({
    Brands: new FormControl({ value: ['all'], disabled: false }),
    subCategory: new FormControl({ value: ['all'], disabled: false }),
    DataSource: new FormControl({ value: ['all'], disabled: false }),
    Years: new FormControl({ value: ['all'], disabled: false }, [
      Validators.required,
    ]),
    rollup: new FormControl({ value: ['all'], disabled: false }),
    Measure: new FormControl({ value: 'all', disabled: false }, [
      Validators.required,
    ]),
  });

  constructor(
    private excelService: ExcelService,
    private _FormBuilder: FormBuilder,
    private loader: SpinnerService
  ) {}

  ngOnInit(): void {
    this.loader.showSpinner();
    this.getDropdowndata().then(() => {
      this.loader.hideSpinner();
    });
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

  async bindData(data: any) {
    const container1 = document.querySelector('#example-basic-multi-sheet-1');
    try {
      // const res = await this.getSummaryData();
      let res : any  = await this.getSummaryDataByBrand(data);
      console.log("BindData_Data",res)
      this.excelData = res;
      let hotInstance: Handsontable;
      if (container1) {
        container1.innerHTML = '';
        hotInstance = new Handsontable(container1, {
          data: res.data,
          colHeaders: true,
          rowHeaders: true,
          width: '100%',
          height: 'auto',
          formulas: {
            engine: this.hyperformulaInstance,
          },
          mergeCells:res.mergeData,
          licenseKey: 'non-commercial-and-evaluation',
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
          // ],
          // hiddenRows: {
          //   rows : [2,3,4]
          // }
        });
      }
    } catch (error) {
      console.error('error:', error);
    }
  }

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
}
