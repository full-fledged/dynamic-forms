import {NgModule} from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import {MatChipsModule} from '@angular/material/chips';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatRadioModule} from '@angular/material/radio';
import {MatButtonModule} from '@angular/material/button';
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
import {LXQ_DATA_TYPE_MAPPING, LXQ_DYNAMIC_FIELD_TYPES, LXQ_ERROR_MESSAGE_MAPPING} from './dynamic-form/dynamic-form-inject-tokens';
import {NG_COMMON_DATA_TYPE_MAPPING} from './dynamic-form/ng-common-datatype-mapping';
import {NG_COMMON_DYNAMIC_FIELD_TYPES} from './dynamic-form/ng-common-dynamic-field-types';
import {NG_COMMON_ERROR_MESSAGE_MAPPING} from './dynamic-form/ng-common-error-message-mapping';
import {ComboboxComponent} from './combobox/combobox.component';

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
    MatButtonModule
  ],
  declarations: [
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
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'nl-NL'},
    {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
    {provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS},
    {provide: LXQ_DATA_TYPE_MAPPING, useValue: NG_COMMON_DATA_TYPE_MAPPING},
    {provide: LXQ_DYNAMIC_FIELD_TYPES, useValue: NG_COMMON_DYNAMIC_FIELD_TYPES},
    {provide: LXQ_ERROR_MESSAGE_MAPPING, useValue: NG_COMMON_ERROR_MESSAGE_MAPPING}
  ]
})
export class DynamicFormModule {
}
