import {AbstractComboboxHelper} from './abstract-combobox-helper';
import {MatLegacyChipInputEvent as MatChipInputEvent} from '@angular/material/legacy-chips';
import {MatLegacyAutocompleteActivatedEvent as MatAutocompleteActivatedEvent} from '@angular/material/legacy-autocomplete';
import {map, scan, shareReplay, startWith, take} from 'rxjs/operators';
import {combineLatest, merge, Observable, Subject} from 'rxjs';
import {UntypedFormControl} from '@angular/forms';
import {ElementRef} from '@angular/core';

export class ValidatedSingleValueHelper extends AbstractComboboxHelper {

  dispatcher$ = new Subject();

  constructor(outerControl: UntypedFormControl,
              innerControl: UntypedFormControl,
              items$: Observable<{ value: any, label: any }[]>) {
    super(outerControl, innerControl, items$);

    this.store$ = this.outerControl.valueChanges
      .pipe(
        startWith(this.outerControl.value),
        val$ => combineLatest([this.items$, val$]),
        map(([items, value]: any[]) => items.find(item => item.value === value)),
        map(item => !!item ? {type: 'SET', item, emit: false} : {type: 'REMOVE', emit: false}),
        action$ => merge(action$, this.dispatcher$),
        scan((state, value) => this.reduce(state, value), {items: []} as any),
        shareReplay(1),
      );

    const sub = this.store$
      .subscribe(store => {
        const values = store.items.map(item => item.value);
        this.outerControl.setValue(values[0], {emitEvent: store.emit});
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
        this.dispatcher$.next({type: 'SET', item, emit: true});
        this.innerControl.setValue(null);
        inputElement.nativeElement.value = '';
      });
  }

  reduce(state, action) {
    if (action.type === 'SET') {
      return {emit: action.emit, items: [action.item]};
    } else if (action.type === 'REMOVE') {
      return {emit: action.emit, items: []};
    }
    return state;
  }
}
