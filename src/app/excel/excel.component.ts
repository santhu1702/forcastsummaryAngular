import { Component } from '@angular/core';
import { ExcelService } from '../_Services/excel.service';
import { subCategory } from 'src/app/_models/subCategory';
import { SummaryData } from '../_models/SummaryData';

@Component({
  selector: 'app-excel',
  templateUrl: './excel.component.html',
  styleUrls: ['./excel.component.css'],
})
export class ExcelComponent {
  constructor(private ExcelService: ExcelService) {}
  dataset: any = this.getsummarydata();

  ngOnInit(): void {
    this.getsubCategory();
    this.getsummarydata();
  }

  getsubCategory() {
    this.ExcelService.getsubCategory().subscribe((category) => {
      return category;
    });
  }
  getsummarydata() {
    this.ExcelService.SummaryData().subscribe((response) => {
      this.dataset = response;
      return response;
    });
  }
 }
