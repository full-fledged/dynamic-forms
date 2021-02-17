import {AbstractControl, FormGroup} from '@angular/forms';
import {DynamicField} from '../dynamic-field.model';
import {Observable} from 'rxjs';

export class AbstractDynamicFieldComponent {

    field: DynamicField;
    control: AbstractControl;
    visible$: Observable<boolean>;
    formGroup: FormGroup;

    constructor(
        protected errorMapping
    ) {
    }

    mapErrors(control: AbstractControl): string[] {
        if (!control.touched) {
            return [];
        }
        return Object.keys(control.errors || {})
            .map(key => {
                if (this.errorMapping[key] && typeof this.errorMapping[key] !== 'function') {
                    return this.errorMapping[key];
                } else if (this.errorMapping[key] && typeof this.errorMapping[key] === 'function') {
                    return this.errorMapping[key](control.errors[key]);
                }
                return key;
            });
    }

    validateExtraBooleanProperty(property: string, defaultValue = true) {
        if (!!this.field.extra && (this.field.extra[property] === true || this.field.extra[property] === false)) {
            return this.field.extra[property];
        }
        return defaultValue;
    }
}
