import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HitorialCitasComponent } from './hitorial-citas.component';

describe('HitorialCitasComponent', () => {
  let component: HitorialCitasComponent;
  let fixture: ComponentFixture<HitorialCitasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HitorialCitasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HitorialCitasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
