import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionarPublicacionesComponent } from './gestionar-publicaciones.component';

describe('GestionarPublicacionesComponent', () => {
  let component: GestionarPublicacionesComponent;
  let fixture: ComponentFixture<GestionarPublicacionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GestionarPublicacionesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GestionarPublicacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
