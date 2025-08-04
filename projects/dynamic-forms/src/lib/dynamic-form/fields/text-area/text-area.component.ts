import {Component, Inject} from '@angular/core';
import {AbstractDynamicFieldComponent} from '../abstract-dynamic-field.component';
import {FF_ERROR_MESSAGE_MAPPING} from '../../dynamic-form-inject-tokens';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatFormField, MatInput, MatError } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
    templateUrl: './text-area.component.html',
    styleUrls: ['./text-area.component.scss'],
    imports: [NgIf, MatFormField, MatInput, FormsModule, ReactiveFormsModule, MatError, AsyncPipe]
})
export class TextAreaComponent extends AbstractDynamicFieldComponent {

  constructor(@Inject(FF_ERROR_MESSAGE_MAPPING) errorMapping) {
    super(errorMapping);
  }

  rows() {
    return this.field.extra?.rows || 3;
  }
}
