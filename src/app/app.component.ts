import {Component, OnInit} from '@angular/core';
import {DYNAMIC_FORM, STANDARD_ITEMS$, VALUE_LABEL_ITEMS$} from './form.constants';
import {FormControl} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {delay, map, startWith} from 'rxjs/operators';
import {ValidatedMultiValueHelper} from 'projects/dynamic-forms/src/public-api';
import {MultiFormSubmitter} from './multi-form-submitter';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  testControl = new FormControl(2);
  multiValuedControl = new FormControl([2]);
  control = new FormControl('bla');
  valueLabelControl = new FormControl();

  standardItems$ = VALUE_LABEL_ITEMS$;

  formConfig = DYNAMIC_FORM;
  items$ = STANDARD_ITEMS$;

  patcher$ = new Subject();

  submit$ = new Subject();
  ValidatedMultiValueHelper = ValidatedMultiValueHelper;


  submitter = MultiFormSubmitter.withValue([{bla: '123'}, {bla: 'bla'}]);

  ctrl = new FormControl({label: 'label a', value: 'value a'});
  blaItems = (value: string) => of([
    {label: 'label a', value: 'value a'},
    {label: 'label b', value: 'value b'},
    {label: 'label c', value: 'value c'}
  ]).pipe(
    map(items => items.filter(it => it.label.indexOf(value) > -1))
  );

  ngOnInit(): void {
    this.control.setValue('item1');
    this.valueLabelControl.setValue('item4');
    this.testControl.valueChanges
      .pipe(startWith(this.testControl.value))
      .subscribe(val => console.log('testcontrol value = ', val));

    of(123)
      .pipe(
        delay(4000)
      )
      .subscribe(() => {
        this.ctrl.setValue({label: 'label b', value: 'value b'});
        this.testControl.setValue(6);
        this.multiValuedControl.setValue([2, 6]);
      });
  }

  patchForm() {
    this.testControl.setValue(3);
    this.patcher$.next({type2: 3, id: 1212313, type: 'scheduled', email: 'qwewqe@123213.nl', cron: 123213});
  }

  submit(event?) {
    if (!!event) {
      console.log(event);
    } else {
      console.log(this.valueLabelControl.value, this.control.value);
    }
  }

  echo() {
    console.log('test control: ', this.testControl.value);
    console.log('multi valued control: ', this.multiValuedControl.value);
  }

  submitMulti() {
    this.submitter.submit()
      .subscribe(console.log);
  }

  addForm() {
    this.submitter.add();
  }

  removeForm(index) {
    this.submitter.remove(index);
  }
}
