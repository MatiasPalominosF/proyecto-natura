import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignViewComponent } from './assign-view.component';

describe('AssignViewComponent', () => {
  let component: AssignViewComponent;
  let fixture: ComponentFixture<AssignViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AssignViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
