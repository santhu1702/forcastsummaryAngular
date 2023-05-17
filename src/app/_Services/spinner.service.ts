import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SpinnerService {
  private isLoading: boolean = false;

  showSpinner(): void {
    this.isLoading = true;
  }

  hideSpinner(): void {
    this.isLoading = false;
  }

  getSpinnerState(): boolean {
    return this.isLoading;
  }
}
