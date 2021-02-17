import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteActivatedEvent} from '@angular/material/autocomplete';
import {Observable, of, Subscription} from 'rxjs';
import {FormControl} from '@angular/forms';
import {ElementRef} from '@angular/core';
import {map, mergeMap, shareReplay, startWith, withLatestFrom} from 'rxjs/operators';

export abstract class AbstractComboboxHelper {

  store$: Observable<{ emit: boolean, items: { value: any, label: any }[] }>;
  subscriptions: Subscription[] = [];

  outerControl: FormControl;
  innerControl: FormControl;

  filtered$: Observable<{ value: any, label: any }[]>;
  items$: Observable<{ value: any, label: any }[]>;

  isFiltered: boolean;

  protected constructor(outerControl: FormControl,
                        innerControl: FormControl,
                        items$: Observable<string[] | { value: any, label: any }[]> |
                          ((value: string) => Observable<string[] | { value: any, label: any }[]>)) {
    this.outerControl = outerControl;
    this.innerControl = innerControl;
    this.isFiltered = typeof items$ === 'function';
    this.items$ = this.setItems(items$);
    this.filtered$ = this.setFilteredItems();
  }

  abstract addValue(event: MatChipInputEvent);

  abstract removeValue(item: { label: any, value: any });

  abstract select(event: MatAutocompleteActivatedEvent | { option: { value: any } }, inputElement: ElementRef<HTMLInputElement>);

  setItems(items$: Observable<string[] | { value: any, label: any }[]> |
    ((value: string) => Observable<string[] | { value: any, label: any }[]>)): Observable<{ value: any, label: any }[]> {
    if (typeof items$ === 'function') {
      return this.innerControl.valueChanges
        .pipe(
          startWith(this.innerControl.value),
          mergeMap(value => items$(value) || of([])),
          map((items: any) => (items || [])
            .map(item => !item?.label && !item?.value ? {label: item, value: item} : item)
          ),
          shareReplay(1),
        );
    }
    return (items$ || of([]))
      .pipe(
        map((items: any) => (items || [])
          .map(item => !item?.label && !item?.value ? {label: item, value: item} : item)
        ),
        shareReplay(1),
      );
  }

  setFilteredItems(): Observable<{ label: string, value: any }[]> {
    return this.innerControl.valueChanges
      .pipe(
        startWith(''),
        withLatestFrom(this.items$),
        map(([value, items]: any) => this.isFiltered ? items : items
          .filter(item => {
            const val = `${!value ? '' : value}`;
            return !!item.label ?
              item.label.toLowerCase().includes(val.toLowerCase()) :
              item.toLowerCase().includes(val.toLowerCase());
          })
        ),
        shareReplay(1)
      );
  }

  compareByProperty(item: any, text: any, property: string): boolean {
    const query = this.toLower(text);
    if (item === undefined || item === null) {
      return false;
    }
    if (item[property] !== undefined && item[property] !== null) {
      return query === this.toLower(item[property]);
    }
    return query === this.toLower(item);
  }

  toLower(input: any): string {
    const text = input === undefined || input === null ? '' : `${input}`;
    return text.toLowerCase();
  }
}
