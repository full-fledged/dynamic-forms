import {ComponentFactoryResolver, Directive, Inject, Input, OnInit, ViewContainerRef} from '@angular/core';
import {FF_DYNAMIC_FIELD_TYPES} from './dynamic-form-inject-tokens';
import {map, shareReplay, startWith} from 'rxjs/operators';
import {combineLatest, of} from 'rxjs';
import {AbstractDynamicFieldComponent} from './fields/abstract-dynamic-field.component';
import {DataTypeMappingModel} from './data-type-mapping.model';

@Directive({
    selector: '[ffDynamicField]',
    standalone: false
})
export class DynamicFieldDirective implements OnInit {

  @Input() ffDynamicField;
  @Input() ffDynamicFieldFormGroup;

  constructor(
    @Inject(FF_DYNAMIC_FIELD_TYPES) private fieldTypes: DataTypeMappingModel,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
    const visible$ = this.isVisible();
    const control = !this.ffDynamicField.name ? null : this.ffDynamicFieldFormGroup.controls[this.ffDynamicField.name];
    const componentClass = this.fieldTypes[this.ffDynamicField.type] || this.fieldTypes.text;
    const component = this.viewContainerRef.createComponent<AbstractDynamicFieldComponent>(componentClass);

    if (!!control) {
      this.setControllerUpdates(visible$, control, component);
    }
    component.instance.control = control;
    component.instance.field = this.ffDynamicField;
    component.instance.visible$ = visible$;
    component.instance.formGroup = this.ffDynamicFieldFormGroup;
  }

  isVisible() {
    const activators$ = !!this.ffDynamicField.activators && this.ffDynamicField.activators
      .map(activator => this.ffDynamicFieldFormGroup.controls[activator.control])
      .map(ctrl => ctrl
        .valueChanges
        .pipe(
          startWith(ctrl.value),
          shareReplay(1)
        )
      );
    return !this.ffDynamicField.activators ?
      of(true) :
      combineLatest(activators$)
        .pipe(
          map(values =>
            values.every((value, index) =>
              typeof this.ffDynamicField.activators[index].condition === 'function' ?
                this.ffDynamicField.activators[index].condition(value) :
                value === this.ffDynamicField.activators[index].condition
            )
          ),
          shareReplay(1),
        );
  }

  setControllerUpdates(visible$, control, component) {
    if (this.ffDynamicField.disabled === true) {
      control.disable();
    }
    const sub = visible$
      .subscribe(visible => {
        if (!visible) {
          control.setValue(control.value);
          control.setValidators([]);
        } else {
          control.setValidators(this.ffDynamicField.validators || []);
        }
        control.updateValueAndValidity();
      });
    component.onDestroy(() => sub.unsubscribe());
  }
}
