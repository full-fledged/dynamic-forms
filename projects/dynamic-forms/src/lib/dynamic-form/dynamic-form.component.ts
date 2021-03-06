import {
  Component,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  QueryList,
  ViewChildren,
  ViewContainerRef
} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {Observable, of, Subscription} from 'rxjs';
import {map, shareReplay, startWith, take} from 'rxjs/operators';
import {DynamicField} from './dynamic-field.model';
import {FF_DATA_TYPE_MAPPING, FF_DYNAMIC_FIELD_TYPES} from './dynamic-form-inject-tokens';
import {NgCommonsUtils} from '../utils/ng-commons.utils';
import * as _merge from 'deepmerge';


@Component({
  templateUrl: './dynamic-form.component.html',
  selector: 'ff-dynamic-form',
  styleUrls: ['./dynamic-form.component.scss']
})
export class DynamicFormComponent implements OnChanges, OnDestroy {

  @ViewChildren('column', {read: ViewContainerRef}) columns: QueryList<any>;

  @Input() config: DynamicField[];
  @Input() buttonText = 'Opslaan';
  @Input() submit$: Observable<void>;
  @Output() submit = new EventEmitter();
  title: string;
  public formGroup: FormGroup;
  public invalid$: Observable<boolean>;
  private patcher$ = of({});
  private subscriptions: Subscription[] = [];

  constructor(
    @Inject(FF_DATA_TYPE_MAPPING) private dataTypeMapping: any,
    @Inject(FF_DYNAMIC_FIELD_TYPES) private fieldTypes: any
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
        [field.name]: new FormControl(field.value, field.validators || [])
      }), {});
    this.formGroup = new FormGroup(formObject);
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
  }

  ngOnDestroy(): void {
    this.subscriptions
      .filter(sub => !!sub && typeof sub.unsubscribe === 'function')
      .forEach(sub => sub.unsubscribe());
  }

  save(event?: any) {
    if (!!event) {
      event.stopPropagation();
    }
    this.patcher$
      .pipe(take(1))
      .subscribe(original => {
        const merge = _merge;
        const overwriteMerge = (destinationArray, sourceArray, options) => sourceArray;
        this.submit.emit(merge(original, this.value, {arrayMerge: overwriteMerge}));
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
