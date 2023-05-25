import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelService } from 'src/app/_Services/excel.service';

@Component({
  selector: 'app-excel-upload',
  templateUrl: './excel-upload.component.html',
  styleUrls: ['./excel-upload.component.css']
})
export class ExcelUploadComponent {
  constructor(public activeModal: NgbActiveModal, private excelService: ExcelService) { }
  selectedFile!: File;

  onSelectedFile(e : any) {
    this.selectedFile = e.target.files[0]
  }
  uploadFile(inputId: string) {
    // const inputElement = document.getElementById(inputId) as HTMLInputElement;
    // const file = inputElement.files ? inputElement.files[0] : null;

    //const file = event.target.files[0]; 
    if (!this.selectedFile) {
      alert("Please select a file to upload.");
      return;
    }

    if (this.selectedFile) {
      // var formData = new FormData();
      // formData.append("Data",this.selectedFile) 
       this.excelService.uploadData(this.selectedFile).subscribe((res: any) => {
        console.log("uploadFile Response", res)
      });

    }
  }


}
