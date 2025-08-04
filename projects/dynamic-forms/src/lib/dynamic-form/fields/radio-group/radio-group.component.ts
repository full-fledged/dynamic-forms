import {Component, Inject} from '@angular/core';
import {AbstractDynamicFieldComponent} from '../abstract-dynamic-field.component';
import {FF_ERROR_MESSAGE_MAPPING} from '../../dynamic-form-inject-tokens';
import { NgIf, NgFor, AsyncPipe } from '@angular/common';
import { MatRadioGroup, MatRadioButton } from '@angular/material/radio';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatError } from '@angular/material/input';

@Component({
    templateUrl: './radio-group.component.html',
    styleUrls: ['./radio-group.component.scss'],
    imports: [NgIf, MatRadioGroup, FormsModule, ReactiveFormsModule, NgFor, MatRadioButton, MatError, AsyncPipe]
})
export class RadioGroupComponent extends AbstractDynamicFieldComponent {

  constructor(@Inject(FF_ERROR_MESSAGE_MAPPING) errorMapping) {
    super(errorMapping);
  }
}
