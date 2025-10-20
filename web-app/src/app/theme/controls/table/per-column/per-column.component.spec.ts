import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerColumnComponent } from './per-column.component';

describe('PerColumnComponent', () => {
  let component: PerColumnComponent;
  let fixture: ComponentFixture<PerColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PerColumnComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PerColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
