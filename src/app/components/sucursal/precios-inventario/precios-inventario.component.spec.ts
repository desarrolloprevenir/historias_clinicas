import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PreciosInventarioComponent } from './precios-inventario.component';

describe('PreciosInventarioComponent', () => {
  let component: PreciosInventarioComponent;
  let fixture: ComponentFixture<PreciosInventarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PreciosInventarioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PreciosInventarioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
