import {delay, map, mergeMap, scan, shareReplay, skip, startWith, take} from 'rxjs/operators';
import {Observable, of, Subject} from 'rxjs';

export class MultiFormSubmitter {

  private sharedSubmitter$ = new Subject();
  private itemsDispatcher$ = new Subject();
  public items$: Observable<{ submit$: Subject<any>, submit: (data: any) => void, patcher$?: Observable<any> }[]>;

  constructor(patchers$ = of([])) {
    this.items$ = patchers$
      .pipe(
        map(values => values.map(value => ({
            submit$: new Subject(),
            submit: (data) => this.sharedSubmitter$.next(data),
            patcher$: of(value)
          }))
        ),
        mergeMap(it => this.itemsDispatcher$.pipe(startWith({type: 'INIT', value: it}))),
        scan((state, action) => this.reduce(state, action), []),
        shareReplay(1)
      );
  }

  submit() {
    this.items$
      .pipe(
        take(1),
        delay(0),
      )
      .subscribe(submitters => submitters
        .map(item => item.submit$)
        .forEach(s => s.next())
      );
    return this.items$
      .pipe(
        mergeMap(items => this.sharedSubmitter$
          .pipe(
            scan((state, value) => [...state, value], []),
            skip(items.length - 1),
          )),
        take(1),
        shareReplay(1)
      );
  }

  add() {
    this.itemsDispatcher$.next({type: 'ADD'});
  }

  remove(index: any) {
    this.itemsDispatcher$.next({type: 'REMOVE', value: index});
  }

  private reduce(state, action) {
    if (action.type === 'INIT') {
      return action.value;
    }
    if (action.type === 'REMOVE') {
      return state
        .filter((item, index) => index !== action.value);
    }
    if (action.type === 'ADD') {
      return [
        ...state,
        {
          submit$: new Subject(),
          submit: (data) => this.sharedSubmitter$.next(data)
        }
      ];
    }
    return [];
  }
}
