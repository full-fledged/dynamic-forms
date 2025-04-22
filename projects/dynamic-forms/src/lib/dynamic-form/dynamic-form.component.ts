import {Component, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output} from '@angular/core';
import {UntypedFormControl, UntypedFormGroup} from '@angular/forms';
import {Observable, of, Subscription} from 'rxjs';
import {map, shareReplay, startWith, take} from 'rxjs/operators';
import {DynamicField} from './dynamic-field.model';
import {FF_DATA_TYPE_MAPPING} from './dynamic-form-inject-tokens';
import {NgCommonsUtils} from '../utils/ng-commons.utils';
import {deepmerge} from './utils/deepmerge';


@Component({
    templateUrl: './dynamic-form.component.html',
    selector: 'ff-dynamic-form',
    styleUrls: ['./dynamic-form.component.scss'],
    standalone: false
})
export class DynamicFormComponent implements OnChanges, OnDestroy {

  @Input() config: DynamicField[];
  @Input() buttonText = 'Opslaan';
  @Input() submit$: Observable<void>;

  // tslint:disable-next-line:no-output-native
  @Output() submit = new EventEmitter();

  public title: string;
  public valid = true;
  public formGroup: UntypedFormGroup;
  public invalid$: Observable<boolean>;
  private patcher$ = of({});
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(FF_DATA_TYPE_MAPPING) private dataTypeMapping: any,
  ) {
  }

  @Input('patcher$') set setPatcher$(input: Observable<any>) {
    this.patcher$ = !input ? of({}) : input.pipe(shareReplay(1));
  }

  get value() {
    return this.expandFormValue(this.formGroup.getRawValue());
  }

  get value$() {
    return this.formGroup.valueChanges
      .pipe(
        map(() => this.formGroup.getRawValue()),
        map(value => this.expandFormValue(value)),
        startWith(this.value)
      );
  }

  ngOnChanges(): void {
    if (!this.config) {
      return;
    }
    const formObject: any = this.config
      .reduce((state, field) => ({
        ...state,
        [field.name]: new UntypedFormControl(field.value, field.validators || [])
      }), {});
    this.formGroup = new UntypedFormGroup(formObject);
    const sub1 = this.patcher$
      .subscribe(value => {
        if (!value) {
          this.formGroup.reset();
        } else {
          this.formGroup.patchValue(NgCommonsUtils.flatten(value));
        }
      });
    this.subscriptions.push(sub1);

    const sub2 = !!this.submit$ && this.submit$
      .subscribe(() => this.save());
    this.subscriptions.push(sub2);
    this.invalid$ = this.formGroup.statusChanges.pipe(map(status => status === 'INVALID'));

    const sub3 = this.invalid$
      .subscribe(val => this.valid = !val);
    this.subscriptions.push(sub3);
  }

  ngOnDestroy(): void {
    this.subscriptions
      .filter(sub => !!sub && typeof sub.unsubscribe === 'function')
      .forEach(sub => sub.unsubscribe());
  }

  markAllAsTouched() {
    this.formGroup.markAllAsTouched();
  }

  save(event?: any) {
    if (!!event) {
      event.stopPropagation();
    }
    this.patcher$
      .pipe(take(1))
      .subscribe(original => {
        const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;
        this.submit.emit(deepmerge(original, this.value, {arrayMerge: overwriteMerge}));
      });
  }

  private expandFormValue(input) {
    const mapped = Object.keys(input)
      .map(key => {
        const config: any = this.config
          .find(field => field.name === key);
        return {config, key, value: this.formGroup.controls[key].value};
      })
      .map(({config, key, value}) => {
        const mappedValue = !!this.dataTypeMapping[config.dataType] ?
          this.dataTypeMapping[config.dataType](value) :
          value;
        return {key, value: mappedValue};
      })
      .reduce((state: any, item: any) => {
        return {
          ...state,
          [item.key]: item.value
        };
      }, {});
    return NgCommonsUtils.expand(mapped);
  }
}
