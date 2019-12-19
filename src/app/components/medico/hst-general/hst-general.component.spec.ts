import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HstGeneralComponent } from './hst-general.component';

describe('HstGeneralComponent', () => {
  let component: HstGeneralComponent;
  let fixture: ComponentFixture<HstGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HstGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HstGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
