import {Injectable} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {filter} from 'rxjs/operators';
import {Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  currentUrl$: Subject<string> = new Subject();

  constructor(private router: Router) {
  }

  setCurrentState() {
    this.currentUrl$.next(this.router.routerState.snapshot.url);

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((navigationEnd: any) => {
      this.currentUrl$.next(navigationEnd.url);
    });
  }

  getCurrentUrl(): Observable<string> {
    return this.currentUrl$;
  }
}
