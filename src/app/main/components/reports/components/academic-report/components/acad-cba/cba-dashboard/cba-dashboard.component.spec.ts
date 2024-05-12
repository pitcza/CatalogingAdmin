import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbaDashboardComponent } from './cba-dashboard.component';

describe('CbaDashboardComponent', () => {
  let component: CbaDashboardComponent;
  let fixture: ComponentFixture<CbaDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CbaDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CbaDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
