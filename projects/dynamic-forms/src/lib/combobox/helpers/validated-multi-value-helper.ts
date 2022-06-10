import {AbstractComboboxHelper} from './abstract-combobox-helper';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteActivatedEvent} from '@angular/material/autocomplete';
import {map, scan, shareReplay, startWith, take} from 'rxjs/operators';
import {combineLatest, merge, Observable, Subject} from 'rxjs';
import {UntypedFormControl} from '@angular/forms';
import {ElementRef} from '@angular/core';

export class ValidatedMultiValueHelper extends AbstractComboboxHelper {

  dispatcher$ = new Subject();

  constructor(outerControl: UntypedFormControl,
              innerControl: UntypedFormControl,
              items$: Observable<{ value: any, label: any }[]>) {
    super(outerControl, innerControl, items$);

    this.store$ = this.outerControl.valueChanges
      .pipe(
        startWith(this.outerControl.value),
        val$ => combineLatest([this.items$, val$]),
        map(([items, values]: any[]) => items
          .filter(item => (values || []).some(val => val === item.value))
        ),
        map(items => !!items ?
          {type: 'SET', items, emit: false} :
          {type: 'SET', items: [], emit: false}
        ),
        action$ => merge(action$, this.dispatcher$),
        scan((state, value) => this.reduce(state, value), {items: []} as any),
        shareReplay(1),
      );

    const sub = this.store$
      .subscribe(store => {
        const values = store.items.map(item => item.value);
        this.outerControl.setValue(values, {emitEvent: store.emit});
      });

    this.subscriptions.push(sub);
  }

  addValue(event: MatChipInputEvent) {
    const input = event.input;
    if (input) {
      input.value = '';
    }
    this.innerControl.setValue(null);
  }

  removeValue(item: { label: any, value: any }) {
    this.dispatcher$.next({type: 'REMOVE', item, emit: true});
  }

  select(event: MatAutocompleteActivatedEvent, inputElement: ElementRef<HTMLInputElement>) {
    this.items$
      .pipe(
        take(1),
        map((items: any[]) => items
          .find(item => this.compareByProperty(item, event.option.value, 'value')))
      )
      .subscribe(item => {
        this.dispatcher$.next({type: 'ADD', item, emit: true});
        this.innerControl.setValue(null);
        inputElement.nativeElement.value = '';
      });
  }

  reduce(state, action) {
    if (action.type === 'SET') {
      return {emit: action.emit, items: action.items};
    } else if (action.type === 'ADD') {
      return {emit: action.emit, items: [...state.items, action.item]};
    } else if (action.type === 'REMOVE') {
      return {emit: action.emit, items: state.items.filter(item => item.value !== action.item.value)};
    }
    return state;
  }
}
