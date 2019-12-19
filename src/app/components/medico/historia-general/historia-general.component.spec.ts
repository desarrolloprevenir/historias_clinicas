import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriaGeneralComponent } from './historia-general.component';

describe('HistoriaGeneralComponent', () => {
  let component: HistoriaGeneralComponent;
  let fixture: ComponentFixture<HistoriaGeneralComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HistoriaGeneralComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HistoriaGeneralComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
