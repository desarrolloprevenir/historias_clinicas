import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarMedicosComponent } from './gestionar-medicos.component';

describe('GestionarMedicosComponent', () => {
  let component: GestionarMedicosComponent;
  let fixture: ComponentFixture<GestionarMedicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarMedicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
