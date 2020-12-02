import {InjectionToken} from '@angular/core';
import {DataTypeMappingModel} from './data-type-mapping.model';

export const FF_DATA_TYPE_MAPPING = new InjectionToken<any>('Data type mapping for dynamic forms');
export const FF_DYNAMIC_FIELD_TYPES = new InjectionToken<DataTypeMappingModel>('Field types for dynamic forms');
export const FF_ERROR_MESSAGE_MAPPING = new InjectionToken<any>('Field types for dynamic forms');
