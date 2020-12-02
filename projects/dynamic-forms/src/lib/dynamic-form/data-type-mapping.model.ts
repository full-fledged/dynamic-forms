import {Type} from '@angular/core';
import {AbstractDynamicFieldComponent} from './fields/abstract-dynamic-field.component';

export interface DataTypeMappingModel {
  [type: string]: Type<AbstractDynamicFieldComponent>;
}
