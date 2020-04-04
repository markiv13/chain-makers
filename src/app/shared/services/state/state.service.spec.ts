import {TestBed} from '@angular/core/testing';

import {StateService} from './state.service';
import {NavigationEnd, NavigationStart, Router, RouterEvent} from '@angular/router';
import {ReplaySubject} from 'rxjs';

describe('StateService', () => {
  let service: StateService;
  let router;
  const eventSubject = new ReplaySubject<RouterEvent>(1);

  beforeEach(() => {
    router = {
      events: eventSubject.asObservable(),
      routerState: {
        snapshot: {
          url: '/path'
        }
      },
    };

    TestBed.configureTestingModule({
      providers: [
        {provide: Router, useValue: router}
      ]
    });

    service = TestBed.get(StateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('#setCurrentState', () => {
    beforeEach(() => {
      spyOn(service.currentUrl$, 'next');
    });

    it('should call currentUrl$.next with correct param', () => {
      service.setCurrentState();

      expect(service.currentUrl$.next).toHaveBeenCalledWith(router.routerState.snapshot.url);
    });

    it('should call currentUrl$.next with correct param', () => {
      eventSubject.next(new NavigationStart(1, '/url'));

      service.setCurrentState();

      expect(service.currentUrl$.next).toHaveBeenCalledWith('/path');
    });

    it('should call currentUrl$.next with correct param', () => {
      eventSubject.next(new NavigationEnd(1, '/url', '/redirectUrl'));

      service.setCurrentState();

      expect(service.currentUrl$.next).toHaveBeenCalledWith('/url');
    });
  });

  describe('#getCurrentUrl', () => {
    it('should #getCurrentUrl return correct data', () => {
      expect(service.getCurrentUrl()).toEqual(service.currentUrl$);
    });
  });
});
