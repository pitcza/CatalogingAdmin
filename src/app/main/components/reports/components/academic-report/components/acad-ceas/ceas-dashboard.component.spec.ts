import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeasDashboardComponent } from './ceas-dashboard.component';

describe('CeasDashboardComponent', () => {
  let component: CeasDashboardComponent;
  let fixture: ComponentFixture<CeasDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CeasDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CeasDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
