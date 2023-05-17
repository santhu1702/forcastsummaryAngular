import { Component } from '@angular/core';
import { SpinnerService } from './_Services/spinner.service';
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent {
    constructor(private spinnerService: SpinnerService) {}
    getSpinnerState(): boolean {
        return this.spinnerService.getSpinnerState();
      }
}
