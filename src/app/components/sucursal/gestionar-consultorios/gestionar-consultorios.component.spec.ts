import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarConsultoriosComponent } from './gestionar-consultorios.component';

describe('GestionarConsultoriosComponent', () => {
  let component: GestionarConsultoriosComponent;
  let fixture: ComponentFixture<GestionarConsultoriosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarConsultoriosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarConsultoriosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
