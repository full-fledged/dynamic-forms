import {EnvironmentProviders, makeEnvironmentProviders, NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {DynamicFieldDirective} from './dynamic-form/dynamic-field.directive';
import {SelectComponent} from './dynamic-form/fields/select/select.component';
import {TextAreaComponent} from './dynamic-form/fields/text-area/text-area.component';
import {TextFieldComponent} from './dynamic-form/fields/text-field/text-field.component';
import {TitleComponent} from './dynamic-form/fields/title/title.component';
import {HiddenComponent} from './dynamic-form/fields/hidden/hidden.component';
import {DynamicFormComponent} from './dynamic-form/dynamic-form.component';
import {ComboboxFieldComponent} from './dynamic-form/fields/combobox/combobox-field.component';
import {DateFieldComponent} from './dynamic-form/fields/date-field/date-field.component';
import {ToggleComponent} from './dynamic-form/fields/toggle/toggle.component';
import {RadioGroupComponent} from './dynamic-form/fields/radio-group/radio-group.component';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from '@angular/material/core';
import {MAT_MOMENT_DATE_FORMATS, MomentDateAdapter} from '@angular/material-moment-adapter';
import {
    FF_DATA_TYPE_MAPPING,
    FF_DYNAMIC_FIELD_TYPES,
    FF_ERROR_MESSAGE_MAPPING
} from './dynamic-form/dynamic-form-inject-tokens';
import {DYNAMIC_FORMS_DATA_TYPE_MAPPING} from './dynamic-form/ng-common-datatype-mapping';
import {DYNAMIC_FORMS_FIELD_TYPES} from './dynamic-form/ng-common-dynamic-field-types';
import {DYNAMIC_FORMS_ERROR_MESSAGE_MAPPING} from './dynamic-form/ng-common-error-message-mapping';
import {ComboboxComponent} from './combobox/combobox.component';
import {MatChipsModule} from '@angular/material/chips';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';

@NgModule({
    imports: [
        MatIconModule,
        MatChipsModule,
        FormsModule,
        ReactiveFormsModule,
        CommonModule,
        MatInputModule,
        MatSelectModule,
        MatAutocompleteModule,
        MatDatepickerModule,
        MatSlideToggleModule,
        MatRadioModule,
        MatButtonModule,
        DynamicFieldDirective,
        SelectComponent,
        TextAreaComponent,
        TextFieldComponent,
        TitleComponent,
        HiddenComponent,
        DynamicFormComponent,
        ComboboxFieldComponent,
        DateFieldComponent,
        ToggleComponent,
        RadioGroupComponent,
        ComboboxComponent
    ],
    exports: [
        DynamicFormComponent,
        ComboboxComponent
    ],
})
export class DynamicFormsModule {
}

export function provideDynamicForms(
    fieldTypes = DYNAMIC_FORMS_FIELD_TYPES,
    errorMapping = DYNAMIC_FORMS_ERROR_MESSAGE_MAPPING,
    dataTypeMapping = DYNAMIC_FORMS_DATA_TYPE_MAPPING): EnvironmentProviders {
    return makeEnvironmentProviders([
        {provide: MAT_DATE_LOCALE, useValue: 'nl-NL'},
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
        {provide: FF_DATA_TYPE_MAPPING, useValue: dataTypeMapping},
        {provide: FF_DYNAMIC_FIELD_TYPES, useValue: fieldTypes},
        {provide: FF_ERROR_MESSAGE_MAPPING, useValue: errorMapping},
    ]);
}
