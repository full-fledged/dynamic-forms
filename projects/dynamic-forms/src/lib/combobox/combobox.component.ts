import {Component, ElementRef, Input, OnChanges, OnDestroy, Type, ViewChild} from '@angular/core';
import {Observable, of} from 'rxjs';
import {FormControl} from '@angular/forms';
import {map, shareReplay} from 'rxjs/operators';
import {MatAutocompleteActivatedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {AbstractComboboxHelper} from './helpers/abstract-combobox-helper';
import {ValidatedSingleValueHelper} from './helpers/validated-single-value-helper';
import {NonValidatedSingleValueHelper} from './helpers/non-validated-single-value-helper';
import {NonValidatedMultiValueHelper} from './helpers/non-validated-multi-value-helper';
import {ValidatedMultiValueHelper} from './helpers/validated-multi-value-helper';

@Component({
  selector: 'lxq-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.scss']
})
export class ComboboxComponent implements OnChanges, OnDestroy {

  @Input() items$: Observable<string[] | { value: string, label: string }[]>;
  @Input() control: FormControl;

  @Input() id: string;
  @Input() label: string;

  @Input() validate = true;
  @Input() multi = false;

  @Input() helperClass: Type<AbstractComboboxHelper>;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  innerControl = new FormControl('');
  helper: AbstractComboboxHelper;

  ngOnChanges() {
    this.ngOnDestroy();
    const items$ = (this.items$ || of([]))
      .pipe(
        map(items => (items || [])
          .map(item => !item?.label && !item?.value ? {label: item, value: item} : item)
        ),
        shareReplay(1),
      );

    if (!!this.helperClass) {
      this.helper = new this.helperClass(this.control, this.innerControl, items$);
    } else if (this.validate && !this.multi) {
      this.helper = new ValidatedSingleValueHelper(this.control, this.innerControl, items$);
    } else if (!this.validate && !this.multi) {
      this.helper = new NonValidatedSingleValueHelper(this.control, this.innerControl, items$);
    } else if (!this.validate && this.multi) {
      this.helper = new NonValidatedMultiValueHelper(this.control, this.innerControl, items$);
    } else if (this.validate && this.multi) {
      this.helper = new ValidatedMultiValueHelper(this.control, this.innerControl, items$);
    } else {
      throw new Error('ComboboxError: Options not implemented');
    }
  }

  ngOnDestroy(): void {
    this.helper?.subscriptions?.forEach(sub => sub.unsubscribe());
  }

  select(event: MatAutocompleteActivatedEvent | { option: { value: any } }) {
    this.helper.select(event, this.input);
  }

  removeValue(item: { label: any, value: any }) {
    this.helper.removeValue(item);
  }

  addValue(event: MatChipInputEvent) {
    this.helper.addValue(event);
  }
}
