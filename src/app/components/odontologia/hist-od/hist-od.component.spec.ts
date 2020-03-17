import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistOdComponent } from './hist-od.component';

describe('HistOdComponent', () => {
  let component: HistOdComponent;
  let fixture: ComponentFixture<HistOdComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistOdComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistOdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
