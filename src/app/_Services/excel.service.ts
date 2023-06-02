import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { subCategory } from 'src/app/_models/subCategory';
import { SummaryData } from '../_models/SummaryData';
import { DropDownsData } from '../_models/DropDownsData';
import { SummaryDataByFilters } from '../_models/SummaryDataByFilters';
import { SummaryDataByBrand } from '../_models/SummaryDataByBrand';
@Injectable({
  providedIn: 'root'
})
export class ExcelService {
  baseurl = environment.apiUrl

  constructor(private http: HttpClient) { }

  SummaryData() {
    return this.http.get<SummaryData[]>(this.baseurl + 'SummaryData');
  }
  getsubCategory() {
    return this.http.get<subCategory[]>(this.baseurl + 'SubCategory');
  }
  dropdowndata() {
    return this.http.get<DropDownsData>(this.baseurl + 'DropDownsData');
  }


  SummaryDataByFilters(summaryData: SummaryDataByFilters) {
    console.log("summaryData", summaryData)
    const url = `${this.baseurl}SummaryDataByFilters`;
    const body = JSON.stringify(summaryData);
    return this.http.post<SummaryDataByBrand>(url, body, {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    });
  }


  
  uploadData(file: any) {
    const url = `${this.baseurl}extractFileUpload`;
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(url, formData);
  }

  getTemplateData() {
    return this.http.get<any>(this.baseurl + 'getData');
  }

  uploadExcelData(data: any) {
     const url = `${this.baseurl}upload`;
    const body = JSON.stringify(data);
    return this.http.post<SummaryDataByBrand>(url, body, {
      headers: new HttpHeaders({ "Content-Type": "application/json" })
    });
  }
}