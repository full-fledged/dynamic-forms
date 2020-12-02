import {Component, Inject} from '@angular/core';
import {AbstractDynamicFieldComponent} from '../abstract-dynamic-field.component';
import {LXQ_ERROR_MESSAGE_MAPPING} from '../../dynamic-form-inject-tokens';

@Component({
  templateUrl: './combobox-field.component.html',
  styleUrls: ['./combobox-field.component.scss']
})
export class ComboboxFieldComponent extends AbstractDynamicFieldComponent {

  constructor(@Inject(LXQ_ERROR_MESSAGE_MAPPING) errorMapping) {
    super(errorMapping);
  }

  get validate() {
    return this.validateExtraBooleanProperty('validate');
  }

  get multi() {
    return this.validateExtraBooleanProperty('multi', false);
  }

  get helperClass() {
    return this.field.extra?.helperClass;
  }
}
