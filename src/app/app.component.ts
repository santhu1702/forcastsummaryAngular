import { Component } from '@angular/core';
import { SpinnerService } from './_Services/spinner.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ExcelUploadComponent } from './excel/excel-upload/excel-upload.component';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent {
  constructor(
    private spinnerService: SpinnerService,
    private modalService: NgbModal
  ) {}
  getSpinnerState(): boolean {
    return this.spinnerService.getSpinnerState();
  }
  open() {
    const modalRef = this.modalService.open(ExcelUploadComponent);
  }
}
