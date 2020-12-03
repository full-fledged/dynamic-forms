import {delay, scan, shareReplay, skip, take} from 'rxjs/operators';
import {of, Subject} from 'rxjs';

export class MultiFormSubmitter {

  private sharedSubmitter$ = new Subject();
  public items: { submit$: Subject<any>, submit: (data: any) => void }[] = [];

  submit() {
    of(true)
      .pipe(delay(0))
      .subscribe(() => {
        this.items
          .map(it => it.submit$)
          .forEach(s => s.next());
      });
    return this.sharedSubmitter$
      .pipe(
        scan((state, value) => [...state, value], []),
        skip(this.items.length - 1),
        take(1),
        shareReplay(1)
      );
  }

  add() {
    this.items.push({
      submit$: new Subject(),
      submit: (data) => this.sharedSubmitter$.next(data)
    });
  }
}
