import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { subCategory } from 'src/app/_models/subCategory';
import { SummaryData } from '../_models/SummaryData';
import { DropDownsData } from '../_models/DropDownsData';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
 baseurl = environment.apiUrl

  constructor(private http : HttpClient ) { }

  SummaryData() {
     return this.http.get<SummaryData[]>(this.baseurl + 'SummaryData');
  }
  getsubCategory() {
    return this.http.get<subCategory[]>(this.baseurl + 'SubCatagoery');
 }
 dropdowndata() {
  return this.http.get<DropDownsData[]>(this.baseurl + 'DropDownsData');
}
}
