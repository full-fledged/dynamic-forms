import {Component, Inject} from '@angular/core';
import {AbstractDynamicFieldComponent} from '../abstract-dynamic-field.component';
import {FF_ERROR_MESSAGE_MAPPING} from '../../dynamic-form-inject-tokens';
import { NgIf, AsyncPipe } from '@angular/common';

@Component({
    templateUrl: './title.component.html',
    styleUrls: ['./title.component.scss'],
    imports: [NgIf, AsyncPipe]
})
export class TitleComponent extends AbstractDynamicFieldComponent {

  constructor(@Inject(FF_ERROR_MESSAGE_MAPPING) errorMapping) {
    super(errorMapping);
  }
}
