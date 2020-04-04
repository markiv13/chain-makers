import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NetworkGraphTopToolbarComponent} from './network-graph-top-toolbar.component';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {RouterTestingModule} from '@angular/router/testing';

describe('NetworkGraphTopToolbarComponent', () => {
  let component: NetworkGraphTopToolbarComponent;
  let fixture: ComponentFixture<NetworkGraphTopToolbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule
      ],
      declarations: [NetworkGraphTopToolbarComponent],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkGraphTopToolbarComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
