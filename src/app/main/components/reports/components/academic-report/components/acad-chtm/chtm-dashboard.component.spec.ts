import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChtmDashboardComponent } from './chtm-dashboard.component';

describe('ChtmDashboardComponent', () => {
  let component: ChtmDashboardComponent;
  let fixture: ComponentFixture<ChtmDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChtmDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChtmDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
