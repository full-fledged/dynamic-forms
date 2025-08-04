import {Component, Inject} from '@angular/core';
import {AbstractDynamicFieldComponent} from '../abstract-dynamic-field.component';
import {FF_ERROR_MESSAGE_MAPPING} from '../../dynamic-form-inject-tokens';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatFormField, MatLabel, MatInput, MatSuffix, MatError } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';

@Component({
    templateUrl: './date-field.component.html',
    styleUrls: ['./date-field.component.scss'],
    imports: [NgIf, MatFormField, MatLabel, MatInput, FormsModule, MatDatepickerInput, ReactiveFormsModule, MatDatepickerToggle, MatSuffix, MatDatepicker, MatError, AsyncPipe]
})
export class DateFieldComponent extends AbstractDynamicFieldComponent {

  constructor(@Inject(FF_ERROR_MESSAGE_MAPPING) errorMapping) {
    super(errorMapping);
  }
}
