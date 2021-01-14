import {of} from 'rxjs';
import {delay} from 'rxjs/operators';
import {Validators} from '@angular/forms';
import {DynamicField} from '../../projects/dynamic-forms/src/lib/dynamic-form/dynamic-field.model';

export const VALUE_LABEL_ITEMS$ = of([
  {value: 1, label: 'Item 1'},
  {value: 2, label: 'Item 2'},
  {value: 3, label: 'Item 3'},
  {value: 4, label: 'Item 4'},
  {value: 5, label: 'Item 5'},
  {value: 6, label: 'Item 6'},
  {value: 7, label: 'Item 7'},
]).pipe(delay(2000));

export const STANDARD_ITEMS$ = of([
  'item1',
  'item6',
  'item5',
  'item4',
  'item3',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
  'item2',
]);

export const DYNAMIC_FORM: DynamicField[] = [
  {
    name: 'date',
    type: 'date',
    dataType: 'date',
    label: 'Date'
  },
  {
    name: 'bla',
    label: 'blae',
    type: 'title'
  },
  {
    name: 'combobox-list',
    label: 'Combobox List',
    value: [1],
    type: 'combobox',
    items$: VALUE_LABEL_ITEMS$,
    extra: {
      multi: true
    },
    validators: [
      Validators.required,
      Validators.email
    ]
  },
  {
    name: 'type',
    label: 'Type',
    value: 'once',
    type: 'select',
    items$: of([
      'once',
      'delayed',
      'scheduled'
    ])
  },
  {
    name: 'pipeline',
    label: 'Pipeline',
    disabled: true,
    activators: [
      {control: 'type', condition: (value) => !!value}
    ]
  },
  {
    name: 'cron',
    label: 'Cron: ',
    validators: [Validators.required],
    activators: [
      {control: 'type', condition: 'scheduled'}
    ]
  },
  {
    name: 'email',
    label: 'E-mail: ',
    validators: [Validators.required, Validators.email, Validators.minLength(7)],
  },
  {
    name: 'description',
    label: 'Beschrijving',
    type: 'textarea',
    activators: [
      {control: 'type', condition: (value) => !!value}
    ]
  },
  {
    name: 'type2',
    label: 'Combobox type',
    type: 'combobox',
    value: 1,
    items$: of([
      {label: 'once', value: 1},
      {label: 'delayed', value: 2},
      {label: 'scheduled', value: 3},
    ]).pipe(delay(3500))
  },
];
