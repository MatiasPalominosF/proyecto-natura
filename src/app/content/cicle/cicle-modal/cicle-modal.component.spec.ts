import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CicleModalComponent } from './cicle-modal.component';

describe('CicleModalComponent', () => {
  let component: CicleModalComponent;
  let fixture: ComponentFixture<CicleModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CicleModalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CicleModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
