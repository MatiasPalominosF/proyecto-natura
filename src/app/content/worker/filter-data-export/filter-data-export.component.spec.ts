import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterDataExportComponent } from './filter-data-export.component';

describe('FilterDataExportComponent', () => {
  let component: FilterDataExportComponent;
  let fixture: ComponentFixture<FilterDataExportComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FilterDataExportComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterDataExportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
