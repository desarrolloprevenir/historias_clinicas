import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GsucursalesComponent } from './gsucursales.component';

describe('GsucursalesComponent', () => {
  let component: GsucursalesComponent;
  let fixture: ComponentFixture<GsucursalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GsucursalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GsucursalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
