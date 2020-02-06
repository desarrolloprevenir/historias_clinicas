import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PerfilProfesionalComponent } from './perfil-profesional.component';

describe('PerfilProfesionalComponent', () => {
  let component: PerfilProfesionalComponent;
  let fixture: ComponentFixture<PerfilProfesionalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PerfilProfesionalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilProfesionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
