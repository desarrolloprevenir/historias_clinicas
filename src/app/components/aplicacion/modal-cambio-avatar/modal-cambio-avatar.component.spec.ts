import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCambioAvatarComponent } from './modal-cambio-avatar.component';

describe('ModalCambioAvatarComponent', () => {
  let component: ModalCambioAvatarComponent;
  let fixture: ComponentFixture<ModalCambioAvatarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCambioAvatarComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCambioAvatarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
