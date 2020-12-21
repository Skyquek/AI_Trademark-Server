import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AbComparisonAllComponent } from './ab-comparison-all.component';

describe('AbComparisonAllComponent', () => {
  let component: AbComparisonAllComponent;
  let fixture: ComponentFixture<AbComparisonAllComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AbComparisonAllComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AbComparisonAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
