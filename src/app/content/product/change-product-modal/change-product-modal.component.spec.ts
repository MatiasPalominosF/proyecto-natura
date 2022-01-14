import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangeProductModalComponent } from './change-product-modal.component';

describe('ChangeProductModalComponent', () => {
  let component: ChangeProductModalComponent;
  let fixture: ComponentFixture<ChangeProductModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChangeProductModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangeProductModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
