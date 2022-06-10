import {MatChipInputEvent} from '@angular/material/chips';
import {MatAutocompleteActivatedEvent} from '@angular/material/autocomplete';
import {combineLatest, Observable, Subscription} from 'rxjs';
import {UntypedFormControl} from '@angular/forms';
import {ElementRef} from '@angular/core';
import {map, shareReplay, startWith} from 'rxjs/operators';

export abstract class AbstractComboboxHelper {

  store$: Observable<{ emit: boolean, items: { value: any, label: any }[] }>;
  subscriptions: Subscription[] = [];

  outerControl: UntypedFormControl;
  innerControl: UntypedFormControl;

  filtered$: Observable<{ value: any, label: any }[]>;
  items$: Observable<{ value: any, label: any }[]>;

  protected constructor(outerControl: UntypedFormControl,
                        innerControl: UntypedFormControl,
                        items$: Observable<{ value: any, label: any }[]>) {
    this.outerControl = outerControl;
    this.innerControl = innerControl;
    this.items$ = items$;

    this.filtered$ = this.setFilteredItems();
  }

  abstract addValue(event: MatChipInputEvent);

  abstract removeValue(item: { label: any, value: any });

  abstract select(event: MatAutocompleteActivatedEvent | { option: { value: any } }, inputElement: ElementRef<HTMLInputElement>);

  setFilteredItems(): Observable<{ label: string, value: any }[]> {
    return combineLatest([this.innerControl.valueChanges.pipe(startWith('')), this.items$])
      .pipe(
        map(([value, items]: any) => items
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
