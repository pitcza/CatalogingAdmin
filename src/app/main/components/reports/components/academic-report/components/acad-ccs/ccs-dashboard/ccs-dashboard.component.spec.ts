import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcsDashboardComponent } from './ccs-dashboard.component';

describe('CcsDashboardComponent', () => {
  let component: CcsDashboardComponent;
  let fixture: ComponentFixture<CcsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CcsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CcsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
