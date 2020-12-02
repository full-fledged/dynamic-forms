import {Component, Inject} from '@angular/core';
import {AbstractDynamicFieldComponent} from '../abstract-dynamic-field.component';
import {LXQ_ERROR_MESSAGE_MAPPING} from '../../dynamic-form-inject-tokens';

@Component({
  templateUrl: './toggle.component.html',
  styleUrls: ['./toggle.component.scss']
})
export class ToggleComponent extends AbstractDynamicFieldComponent {

  constructor(@Inject(LXQ_ERROR_MESSAGE_MAPPING) errorMapping) {
    super(errorMapping);
  }
}
