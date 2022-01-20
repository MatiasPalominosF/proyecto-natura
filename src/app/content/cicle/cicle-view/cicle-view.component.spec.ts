import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CicleViewComponent } from './cicle-view.component';

describe('AssignViewComponent', () => {
  let component: CicleViewComponent;
  let fixture: ComponentFixture<CicleViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CicleViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CicleViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
