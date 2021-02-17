import {AbstractComboboxHelper} from './abstract-combobox-helper';
import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteActivatedEvent} from '@angular/material/autocomplete';
import {map, mergeMap, scan, shareReplay, startWith, take, withLatestFrom} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';
import {FormControl} from '@angular/forms';
import {ElementRef} from '@angular/core';

export class ValidatedSingleValueHelper extends AbstractComboboxHelper {

  dispatcher$ = new Subject();

  constructor(outerControl: FormControl,
              innerControl: FormControl,
              items$: Observable<string[] | { value: any, label: any }[]> |
                ((value: string) => Observable<string[] | { value: any, label: any }[]>)) {
    super(outerControl, innerControl, items$);

    this.store$ = this.outerControl.valueChanges
      .pipe(
        startWith(this.outerControl.value),
        withLatestFrom(this.items$),
        map(([value, items]: any[]) => items.find(item => item.value === value) ||
          (value.value && value.label ? value : {value, label: value})
        ),
        map(item => !!item ? {type: 'SET', item, emit: false} : {type: 'REMOVE', emit: false}),
        mergeMap(action => this.dispatcher$.pipe(startWith(action))),
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
