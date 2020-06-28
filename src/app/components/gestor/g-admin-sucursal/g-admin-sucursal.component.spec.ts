import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GAdminSucursalComponent } from './g-admin-sucursal.component';

describe('GAdminSucursalComponent', () => {
  let component: GAdminSucursalComponent;
  let fixture: ComponentFixture<GAdminSucursalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GAdminSucursalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GAdminSucursalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
