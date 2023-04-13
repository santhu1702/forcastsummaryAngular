import { Component, ElementRef, ViewChild } from '@angular/core';
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

  constructor(private excelService: ExcelService) { }

  // data1 = [
  //   ['10.26', null, 'Sum', '=SUM(A:A)'],
  //   ['20.12', null, 'Average', '=AVERAGE(A:A)'],
  //   ['30.01', null, 'Median', '=MEDIAN(A:A)'],
  //   ['40.29', null, 'MAX', '=MAX(A:A)'],
  //   ['50.18', null, 'MIN', '=MIN(A1:A5)'],
  //   [''],
  //   ['=SUM(A1:A5)', null, '', '']
  // ];

  ngOnInit(): void {
    this.binddata();

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
          console.log(response)
          // const summaryData = response.map(item => Object.values(item).slice(1));
          resolve(response);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  }
  
  

  async binddata() {
    const container1 = document.querySelector('#example-basic-multi-sheet-1');
    debugger
    await this.getsummarydata().then(
      (res) => {
        this.data1 = res
      }
    ); 
    console.log(this.data1)
    if (container1) {
      new Handsontable(container1, {
        data:  this.data1.data,
        colHeaders: true,
        rowHeaders: true,
        height: 'auto',
        formulas: {
          engine: this.hyperformulaInstance,
        },
        mergeCells:  this.data1.summaryDataArray,
        licenseKey: 'non-commercial-and-evaluation'
      });
    }
  }
}
// mergeCells: [
//   {row: 1, col: 0, rowspan: 3, colspan: 1},
//   {row: 5, col: 0, rowspan: 3, colspan: 1},
//   {row: 9, col: 0, rowspan: 3, colspan: 1},
//   {row: 13, col: 0, rowspan: 3, colspan: 1},

// ],