import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimpleAbComparisonComponent } from './simple-ab-comparison.component';

describe('SimpleAbComparisonComponent', () => {
  let component: SimpleAbComparisonComponent;
  let fixture: ComponentFixture<SimpleAbComparisonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SimpleAbComparisonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SimpleAbComparisonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
