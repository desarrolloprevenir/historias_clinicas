import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GmedicosComponent } from './gmedicos.component';

describe('GmedicosComponent', () => {
  let component: GmedicosComponent;
  let fixture: ComponentFixture<GmedicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GmedicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GmedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
