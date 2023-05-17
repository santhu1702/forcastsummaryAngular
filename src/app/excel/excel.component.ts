import { Component } from '@angular/core';
import { ExcelService } from '../_Services/excel.service';
import { HotTableComponent } from '@handsontable/angular';
import Handsontable from 'handsontable';
import HyperFormula from 'hyperformula';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css'],
})
export class ExcelComponent {
  data1: any;
  hotElement!: HotTableComponent;

  constructor(private excelService: ExcelService) {}

  ngOnInit(): void {
    this.binddata();
    this.getDropdowndata();
    // this.
  }

  hyperformulaInstance = HyperFormula.buildEmpty({
    licenseKey: 'internal-use-in-handsontable',
  });

  getsubCategory() {
    this.excelService.getsubCategory().subscribe((category) => {
      return category;
    });
  }

  async getsummarydata() {
    return new Promise((resolve, reject) => {
      this.excelService.SummaryData().subscribe({
        next: (response) => {
          console.log(response);
          // const summaryData = response.map(item => Object.values(item).slice(1));
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
      this.data1 = res;
    });
    console.log(this.data1);
    if (container1) {
      new Handsontable(container1, {
        data: this.data1.data,
        colHeaders: true,
        rowHeaders: true,
        height: 'auto',
        formulas: {
          engine: this.hyperformulaInstance,
        },
        mergeCells: this.data1.summaryDataArray,
        licenseKey: 'non-commercial-and-evaluation',
      });
    }
  }

  async getDropdowndata() {
    return new Promise((resolve, reject) => {
      this.excelService.dropdowndata().subscribe({
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
}
