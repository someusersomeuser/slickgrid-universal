import { RxJsFacade } from '@slickgrid-universal/common';
import { EMPTY, iif, isObservable, firstValueFrom, Observable, Subject, switchMap, ObservableInput, OperatorFunction, ObservedValueOf } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

export class RxJsResource implements RxJsFacade {
  readonly className = 'RxJsResource';

  /**
   * The same Observable instance returned by any call to without a scheduler.
   * This returns the EMPTY constant from RxJS
   */
  get EMPTY(): Observable<never> {
    return EMPTY;
  }

  /** Simple method to create an Observable */
  createObservable<T>(): Observable<T> {
    return new Observable<T>();
  }

  /** Simple method to create an Subject */
  createSubject<T>(): Subject<T> {
    return new Subject<T>();
  }

  firstValueFrom<T>(source: Observable<T>): Promise<T> {
    return firstValueFrom(source);
  }

  iif<T = never, F = never>(condition: () => boolean, trueResult?: any, falseResult?: any): Observable<T | F> {
    return iif<T, F>(condition, trueResult, falseResult);
  }

  /** Tests to see if the object is an RxJS Observable */
  isObservable(obj: any): boolean {
    return isObservable(obj);
  }

  switchMap<T, O extends ObservableInput<any>>(project: (value: T, index: number) => O): OperatorFunction<T, ObservedValueOf<O>> {
    return switchMap(project);
  }

  /** Emits the values emitted by the source Observable until a `notifier` Observable emits a value. */
  takeUntil<T>(notifier: Observable<any>): any {
    return takeUntil<T>(notifier);
  }
}