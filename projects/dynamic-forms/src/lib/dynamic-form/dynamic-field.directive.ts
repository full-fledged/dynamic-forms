import {
  ComponentFactoryResolver,
  ComponentRef,
  Directive,
  Inject,
  Input,
  OnInit, Type,
  ViewContainerRef
} from '@angular/core';
import {LXQ_DYNAMIC_FIELD_TYPES} from './dynamic-form-inject-tokens';
import {map, shareReplay, startWith} from 'rxjs/operators';
import {combineLatest, of} from 'rxjs';
import {AbstractDynamicFieldComponent} from './fields/abstract-dynamic-field.component';
import {DataTypeMappingModel} from './data-type-mapping.model';

@Directive({
  selector: '[lxqDynamicField]'
})
export class DynamicFieldDirective implements OnInit {

  @Input() lxqDynamicField;
  @Input() lxqDynamicFieldFormGroup;

  constructor(
    @Inject(LXQ_DYNAMIC_FIELD_TYPES) private fieldTypes: DataTypeMappingModel,
    private componentFactoryResolver: ComponentFactoryResolver,
    private viewContainerRef: ViewContainerRef
  ) {
  }

  ngOnInit(): void {
    const visible$ = this.mapInstanceValues();
    const control = !this.lxqDynamicField.name ? null : this.lxqDynamicFieldFormGroup.controls[this.lxqDynamicField.name];
    const componentClass = this.fieldTypes[this.lxqDynamicField.type] || this.fieldTypes.text;
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    const component = this.viewContainerRef.createComponent<AbstractDynamicFieldComponent>(componentFactory);

    if (!!control) {
      this.setControllerUpdates(visible$, control, component);
    }
    component.instance.control = control;
    component.instance.field = this.lxqDynamicField;
    component.instance.visible$ = visible$;
    component.instance.formGroup = this.lxqDynamicFieldFormGroup;
  }

  mapInstanceValues() {
    const activators$ = !!this.lxqDynamicField.activators && this.lxqDynamicField.activators
      .map(activator => this.lxqDynamicFieldFormGroup.controls[activator.control])
      .map(ctrl => ctrl
        .valueChanges
        .pipe(
          startWith(ctrl.value),
          shareReplay(1)
        )
      );
    return !this.lxqDynamicField.activators ? of(true) :
      combineLatest(activators$)
        .pipe(
          map(values =>
            values.every((value, index) =>
              typeof this.lxqDynamicField.activators[index].condition === 'function' ?
                this.lxqDynamicField.activators[index].condition(value) :
                value === this.lxqDynamicField.activators[index].condition
            )
          ),
          shareReplay(1),
        );
  }

  setControllerUpdates(visible$, control, component) {
    if (this.lxqDynamicField.disabled === true) {
      control.disable();
    }
    const sub = visible$
      .subscribe(visible => {
        if (!visible) {
          control.setValue(control.value);
          control.setValidators([]);
        } else {
          control.setValidators(this.lxqDynamicField.validators);
        }
        control.updateValueAndValidity();
      });
    component.onDestroy(() => sub.unsubscribe());
  }
}
