import {Component, OnInit} from '@angular/core';
import {DYNAMIC_FORM, STANDARD_ITEMS$, VALUE_LABEL_ITEMS$} from './form.constants';
import {UntypedFormControl} from '@angular/forms';
import {of, Subject} from 'rxjs';
import {delay, startWith} from 'rxjs/operators';
import {ValidatedMultiValueHelper} from 'projects/dynamic-forms/src/public-api';
import {MultiFormSubmitter} from './multi-form-submitter';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    standalone: false
})
export class AppComponent implements OnInit {
  testControl = new UntypedFormControl(2);
  multiValuedControl = new UntypedFormControl([2]);
  control = new UntypedFormControl('bla');
  valueLabelControl = new UntypedFormControl();

  standardItems$ = VALUE_LABEL_ITEMS$;

  formConfig = DYNAMIC_FORM;
  items$ = STANDARD_ITEMS$;

  patcher$ = new Subject();

  submit$ = new Subject();
  ValidatedMultiValueHelper = ValidatedMultiValueHelper;


  submitter = MultiFormSubmitter.withValue([{bla: '123'}, {bla: 'bla'}]);

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
