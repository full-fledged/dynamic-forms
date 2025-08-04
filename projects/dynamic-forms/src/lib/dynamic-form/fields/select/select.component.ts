import {Component, Inject} from '@angular/core';
import {AbstractDynamicFieldComponent} from '../abstract-dynamic-field.component';
import {FF_ERROR_MESSAGE_MAPPING} from '../../dynamic-form-inject-tokens';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatFormField, MatLabel, MatError } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss'],
    imports: [NgIf, MatFormField, MatLabel, MatSelect, FormsModule, ReactiveFormsModule, NgFor, MatOption, MatError, AsyncPipe]
})
export class SelectComponent extends AbstractDynamicFieldComponent {

  constructor(@Inject(FF_ERROR_MESSAGE_MAPPING) errorMapping) {
    super(errorMapping);
  }
}
