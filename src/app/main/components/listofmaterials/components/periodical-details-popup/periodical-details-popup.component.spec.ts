import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicalDetailsPopupComponent } from './periodical-details-popup.component';

describe('PeriodicalDetailsPopupComponent', () => {
  let component: PeriodicalDetailsPopupComponent;
  let fixture: ComponentFixture<PeriodicalDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeriodicalDetailsPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeriodicalDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
