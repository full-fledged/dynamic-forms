import {Component, Inject} from '@angular/core';
import {AbstractDynamicFieldComponent} from '../abstract-dynamic-field.component';
import {FF_ERROR_MESSAGE_MAPPING} from '../../dynamic-form-inject-tokens';
import { AsyncPipe } from '@angular/common';
import { MatFormField, MatInput, MatError } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    templateUrl: './text-field.component.html',
    styleUrls: ['./text-field.component.scss'],
    imports: [MatFormField, MatInput, FormsModule, ReactiveFormsModule, MatError, AsyncPipe]
})
export class TextFieldComponent extends AbstractDynamicFieldComponent {

  constructor(@Inject(FF_ERROR_MESSAGE_MAPPING) errorMapping) {
    super(errorMapping);
  }
}
