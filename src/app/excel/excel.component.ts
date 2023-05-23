import { Component, ViewChild } from '@angular/core';
import { ExcelService } from '../_Services/excel.service';
import Handsontable from 'handsontable';
import HyperFormula from 'hyperformula';
import { DropDownsData } from '../_models/DropDownsData';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
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
  ddnrollUps: string[] = ['Quarter Ups', 'Half MAT', 'Full Year'];
  ddnMeasure: any[] = [
    '$ Sales CATEGORY',
    '% Chg CATEGORY',
    '$ Sales UNILEVER',
    '% Chg UNILEVER',
    ' UL $ Share',
  ];
  dropDownForm = this._FormBuilder.group({
    Brands: new FormControl(),
    subCategory: new FormControl(),
    DataSource: new FormControl(),
    Years: new FormControl([Validators.required]),
    rollup: new FormControl(),
    Measure: new FormControl([Validators.required]),
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
    // setTimeout(() => {
    // this.getDropdowndata();
    // }, 5000);
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
      const res = await this.getSummaryDataByBrand(data);
      this.excelData = res;

      if (container1) {
        container1.innerHTML = '';
        const hotInstance = new Handsontable(container1, {
          data: this.excelData.data,
          colHeaders: true,
          rowHeaders: true,
          height: 'auto',
          formulas: {
            engine: this.hyperformulaInstance,
          },
          mergeCells: this.excelData.mergeData,
          licenseKey: 'non-commercial-and-evaluation',
          // hiddenRows: {
          //   rows : [2,3,4]
          // }
        }); 
      }
    } catch (error) {
      console.error('An error occurred while binding data:', error);
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
