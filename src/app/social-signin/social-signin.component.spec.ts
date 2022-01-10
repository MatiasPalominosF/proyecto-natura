import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SocialSigninComponent } from './social-signin.component';

describe('SocialSigninComponent', () => {
  let component: SocialSigninComponent;
  let fixture: ComponentFixture<SocialSigninComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SocialSigninComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SocialSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
