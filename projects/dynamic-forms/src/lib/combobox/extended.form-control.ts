import {AbstractControlOptions, AsyncValidatorFn, FormControl, ValidatorFn} from '@angular/forms';
import {Subject} from 'rxjs';
import {startWith} from 'rxjs/operators';

export class ExtendedFormControl extends FormControl {

  // tslint:disable-next-line:variable-name
  private _touched$: Subject<boolean> = new Subject<boolean>();

  touched$ = this._touched$.pipe(startWith(false));

  constructor(
    formState?: any,
    validatorOrOpts?: ValidatorFn | ValidatorFn[] | AbstractControlOptions | null,
    asyncValidator?: AsyncValidatorFn | AsyncValidatorFn[] | null
  ) {
    super(formState, validatorOrOpts, asyncValidator);
  }

  markAsTouched(opts?: { onlySelf?: boolean; }): void {
    super.markAsTouched(opts);
    this._touched$.next(true);
  }
}
