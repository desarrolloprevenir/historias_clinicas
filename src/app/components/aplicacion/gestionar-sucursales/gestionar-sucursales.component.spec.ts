import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarSucursalesComponent } from './gestionar-sucursales.component';

describe('GestionarSucursalesComponent', () => {
  let component: GestionarSucursalesComponent;
  let fixture: ComponentFixture<GestionarSucursalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarSucursalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarSucursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
