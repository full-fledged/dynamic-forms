import {Component, ElementRef, Input, OnChanges, OnDestroy, Type, ViewChild} from '@angular/core';
import {Observable} from 'rxjs';
import {FormControl} from '@angular/forms';
import {filter} from 'rxjs/operators';
import {MatAutocompleteActivatedEvent} from '@angular/material/autocomplete';
import {MatChipInputEvent} from '@angular/material/chips';
import {AbstractComboboxHelper} from './helpers/abstract-combobox-helper';
import {ValidatedSingleValueHelper} from './helpers/validated-single-value-helper';
import {NonValidatedSingleValueHelper} from './helpers/non-validated-single-value-helper';
import {NonValidatedMultiValueHelper} from './helpers/non-validated-multi-value-helper';
import {ValidatedMultiValueHelper} from './helpers/validated-multi-value-helper';
import {ExtendedFormControl} from './extended.form-control';

@Component({
  selector: 'ff-combobox',
  templateUrl: './combobox.component.html',
  styleUrls: ['./combobox.component.scss']
})
export class ComboboxComponent implements OnChanges, OnDestroy {

  @Input() items$: Observable<string[] | { value: any, label: any }[]> |
    ((value: string) => Observable<string[] | { value: any, label: any }[]>);
  @Input() control: FormControl;

  @Input() id: string;
  @Input() label: string;

  @Input() validate = true;
  @Input() multi = false;

  @Input() helperClass: Type<AbstractComboboxHelper>;

  @ViewChild('input') input: ElementRef<HTMLInputElement>;

  innerControl = new ExtendedFormControl('');
  helper: AbstractComboboxHelper;

  ngOnChanges() {
    this.ngOnDestroy();

    if (!this.control) {
      throw new Error('[control] input is mandatory for this component]');
    }
    if (!!this.helperClass) {
      this.helper = new this.helperClass(this.control, this.innerControl, this.items$);
    } else if (this.validate && !this.multi) {
      this.helper = new ValidatedSingleValueHelper(this.control, this.innerControl, this.items$);
    } else if (!this.validate && !this.multi) {
      this.helper = new NonValidatedSingleValueHelper(this.control, this.innerControl, this.items$);
    } else if (!this.validate && this.multi) {
      this.helper = new NonValidatedMultiValueHelper(this.control, this.innerControl, this.items$);
    } else if (this.validate && this.multi) {
      this.helper = new ValidatedMultiValueHelper(this.control, this.innerControl, this.items$);
    } else {
      throw new Error('ComboboxError: Options not implemented');
    }
    const sub = this.innerControl.touched$
      .pipe(filter(touched => touched))
      .subscribe(touched => this.control?.markAsTouched());
    this.helper.subscriptions.push(sub);
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
