import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
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
    return this.http.get<subCategory[]>(this.baseurl + 'SubCatagoery');
  }
  dropdowndata() {
    return this.http.get<DropDownsData>(this.baseurl + 'DropDownsData');
  }

  SummaryDataByFilters(summaryData: SummaryDataByFilters) {
    console.log("summaeydata", summaryData)
    const url = `${this.baseurl}/SummaryDataByFilters`;
    const params : any = {
      subCatagoery: summaryData.subCategory.join(','),
      source: summaryData.DataSource.join(','), 
      brands: summaryData.Brands.join(','),
      years: summaryData.Years.join(','),
      rollup: summaryData.rollup.join(','),
      Measure: summaryData.Measure
    };
    // let params: any = {
    //   Brands: summaryData.Brands
    // }
    // let params: any = [];
    // params.brands = summaryData.Brands
    // params.years =  summaryData.Years
     console.log("parms", params)
    // const params = new HttpParams().append('brands', summaryData.Brands.join(','));

    return this.http.get<SummaryDataByBrand>(url,  {params} );
  }
}
