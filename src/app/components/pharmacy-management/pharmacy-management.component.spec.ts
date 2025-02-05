import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PharmacyManagementComponent } from './pharmacy-management.component';

describe('PharmacyManagementComponent', () => {
  let component: PharmacyManagementComponent;
  let fixture: ComponentFixture<PharmacyManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PharmacyManagementComponent]
    });
    fixture = TestBed.createComponent(PharmacyManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
