import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalOptometriaComponent } from './modal-optometria.component';

describe('ModalOptometriaComponent', () => {
  let component: ModalOptometriaComponent;
  let fixture: ComponentFixture<ModalOptometriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalOptometriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalOptometriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
