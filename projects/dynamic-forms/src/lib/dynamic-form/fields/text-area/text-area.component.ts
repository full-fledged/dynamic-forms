import {Component, Inject} from '@angular/core';
import {AbstractDynamicFieldComponent} from '../abstract-dynamic-field.component';
import {LXQ_ERROR_MESSAGE_MAPPING} from '../../dynamic-form-inject-tokens';

@Component({
  templateUrl: './text-area.component.html',
  styleUrls: ['./text-area.component.scss']
})
export class TextAreaComponent extends AbstractDynamicFieldComponent {

  constructor(@Inject(LXQ_ERROR_MESSAGE_MAPPING) errorMapping) {
    super(errorMapping);
  }
}
