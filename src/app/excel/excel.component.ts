import { Component } from '@angular/core';
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

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css'],
})
export class ExcelComponent {
  excelData: any;
  dropdownData: any = [];
  ddnDataSource: any = [];
  ddnCategory: any = [];
  ddnBrands: any = [];
  ddnYears: any = [];
  ddnrollUps: any = ['Quarter Ups', 'Half MAT', 'Full Year'];
  ddnMeasure: any = [
    '$ Sales CATEGORY',
    '% Chg CATEGORY',
    '$ Sales UNILEVER',
    '% Chg UNILEVER',
    ' UL $ Share',
  ];
  excelForm = this._FormBuilder.group({
    Brands: new FormControl(
      { value: 'all', disabled: false },
      Validators.required
    ),
    Category: new FormControl(
      { value: 'all', disabled: false },
      Validators.required
    ),
    DataSource: new FormControl(
      { value: 'all', disabled: false },
      Validators.required
    ),
    Years: new FormControl(
      { value: 'all', disabled: false },
      Validators.required
    ),
    rollup: new FormControl(
      { value: 'all', disabled: false },
      Validators.required
    ),
    Measure: new FormControl(
      { value: 'all', disabled: false },
      Validators.required
    ),
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
    await this.binddata();
    this.loader.hideSpinner();
  }

  async getsummarydata() {
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

  async binddata() {
    const container1 = document.querySelector('#example-basic-multi-sheet-1');
    await this.getsummarydata().then((res) => {
      this.excelData = res;
      if (container1) {
        container1.innerHTML = '';
        new Handsontable(container1, {
          data: this.excelData.data,
          colHeaders: true,
          rowHeaders: true,
          height: 'auto',
          formulas: {
            engine: this.hyperformulaInstance,
          },
          mergeCells: this.excelData.summaryDataArray,
          licenseKey: 'non-commercial-and-evaluation',
        });
      }
    });
  }
  async getDropdowndata() {
    return new Promise((resolve, reject) => {
      this.excelService.dropdowndata().subscribe({
        next: (response: DropDownsData) => {
          this.ddnBrands = response.brands;
          this.ddnCategory = response.subCategories;
          this.ddnDataSource = response.sources;
          this.ddnYears = response.years;
          console.log(this.ddnCategory);
          resolve(response);
        },
        error: (error) => {
          reject(error);
        },
      });
    });
  }
}
