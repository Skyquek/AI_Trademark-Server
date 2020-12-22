import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchResultElementComponent } from './search-result-element.component';

describe('SearchResultElementComponent', () => {
  let component: SearchResultElementComponent;
  let fixture: ComponentFixture<SearchResultElementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchResultElementComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchResultElementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
