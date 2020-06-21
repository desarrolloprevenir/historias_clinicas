import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GserviciosComponent } from './gservicios.component';

describe('GserviciosComponent', () => {
  let component: GserviciosComponent;
  let fixture: ComponentFixture<GserviciosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GserviciosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GserviciosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
