import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaOptometriaComponent } from './historia-optometria.component';

describe('HistoriaOptometriaComponent', () => {
  let component: HistoriaOptometriaComponent;
  let fixture: ComponentFixture<HistoriaOptometriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriaOptometriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriaOptometriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
