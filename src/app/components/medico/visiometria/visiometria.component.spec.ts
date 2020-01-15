import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VisiometriaComponent } from './visiometria.component';

describe('VisiometriaComponent', () => {
  let component: VisiometriaComponent;
  let fixture: ComponentFixture<VisiometriaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VisiometriaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VisiometriaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
