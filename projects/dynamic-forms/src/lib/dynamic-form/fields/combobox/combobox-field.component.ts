import {Component, Inject} from '@angular/core';
import {AbstractDynamicFieldComponent} from '../abstract-dynamic-field.component';
import {FF_ERROR_MESSAGE_MAPPING} from '../../dynamic-form-inject-tokens';

@Component({
    templateUrl: './combobox-field.component.html',
    styleUrls: ['./combobox-field.component.scss'],
    standalone: false
})
export class ComboboxFieldComponent extends AbstractDynamicFieldComponent {

  constructor(@Inject(FF_ERROR_MESSAGE_MAPPING) errorMapping) {
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
