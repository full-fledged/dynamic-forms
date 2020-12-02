import {ValidatorFn} from '@angular/forms';
import {Observable} from 'rxjs';

export interface DynamicField {
  label?: string;
  name?: string;
  value?: any;
  type?: string;
  dataType?: string;
  validators?: ValidatorFn[];
  activators?: { control: string, condition: ((value: any) => boolean) | any }[];
  items$?: Observable<string[] | { value: any, label: string }[]>;
  extra?: any;
  disabled?: boolean;
}
