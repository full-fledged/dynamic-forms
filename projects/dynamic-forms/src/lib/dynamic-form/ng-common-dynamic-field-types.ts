import {TitleComponent} from './fields/title/title.component';
import {TextFieldComponent} from './fields/text-field/text-field.component';
import {SelectComponent} from './fields/select/select.component';
import {TextAreaComponent} from './fields/text-area/text-area.component';
import {HiddenComponent} from './fields/hidden/hidden.component';
import {ComboboxFieldComponent} from './fields/combobox/combobox-field.component';
import {DateFieldComponent} from './fields/date-field/date-field.component';
import {ToggleComponent} from './fields/toggle/toggle.component';
import {RadioGroupComponent} from './fields/radio-group/radio-group.component';

export const DYNAMIC_FORMS_FIELD_TYPES = {
  title: TitleComponent,
  text: TextFieldComponent,
  select: SelectComponent,
  textarea: TextAreaComponent,
  hidden: HiddenComponent,
  combobox: ComboboxFieldComponent,
  date: DateFieldComponent,
  toggle: ToggleComponent,
  radio: RadioGroupComponent
};
