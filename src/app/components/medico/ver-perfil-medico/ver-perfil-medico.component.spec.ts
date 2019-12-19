import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPerfilMedicoComponent } from './ver-perfil-medico.component';

describe('VerPerfilMedicoComponent', () => {
  let component: VerPerfilMedicoComponent;
  let fixture: ComponentFixture<VerPerfilMedicoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerPerfilMedicoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPerfilMedicoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
