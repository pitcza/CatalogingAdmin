import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CahsDashboardComponent } from './cahs-dashboard.component';

describe('CahsDashboardComponent', () => {
  let component: CahsDashboardComponent;
  let fixture: ComponentFixture<CahsDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CahsDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CahsDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
