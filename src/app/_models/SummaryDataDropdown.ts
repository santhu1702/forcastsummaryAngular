import { FormControl } from "@angular/forms";

export interface SummaryDataDropdown {
    Brands: FormControl<string | null>;
    Category: FormControl<string | null>;
    DataSource: FormControl<string | null>;
    Years: FormControl<string | null>;
    rollup: FormControl<string | null>;
    Measure: FormControl<string | null>;
  }