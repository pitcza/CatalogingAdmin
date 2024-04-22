import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PerioDetailsComponent } from './perio-details.component';

describe('PerioDetailsComponent', () => {
  let component: PerioDetailsComponent;
  let fixture: ComponentFixture<PerioDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PerioDetailsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PerioDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
