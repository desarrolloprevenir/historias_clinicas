import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GCreaServicioComponent } from './gcrea-servicio.component';

describe('GCreaServicioComponent', () => {
  let component: GCreaServicioComponent;
  let fixture: ComponentFixture<GCreaServicioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GCreaServicioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GCreaServicioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
