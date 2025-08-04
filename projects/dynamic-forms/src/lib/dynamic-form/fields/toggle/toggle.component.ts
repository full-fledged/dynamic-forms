import {Component, Inject} from '@angular/core';
import {AbstractDynamicFieldComponent} from '../abstract-dynamic-field.component';
import {FF_ERROR_MESSAGE_MAPPING} from '../../dynamic-form-inject-tokens';
import { NgIf, AsyncPipe } from '@angular/common';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatError } from '@angular/material/input';

@Component({
    templateUrl: './toggle.component.html',
    styleUrls: ['./toggle.component.scss'],
    imports: [NgIf, MatSlideToggle, FormsModule, ReactiveFormsModule, MatError, AsyncPipe]
})
export class ToggleComponent extends AbstractDynamicFieldComponent {

  constructor(@Inject(FF_ERROR_MESSAGE_MAPPING) errorMapping) {
    super(errorMapping);
  }
}
