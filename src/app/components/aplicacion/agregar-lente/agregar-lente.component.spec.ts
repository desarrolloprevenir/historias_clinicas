import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AgregarLenteComponent } from './agregar-lente.component';

describe('AgregarLenteComponent', () => {
  let component: AgregarLenteComponent;
  let fixture: ComponentFixture<AgregarLenteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AgregarLenteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AgregarLenteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
