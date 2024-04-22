import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicalComponent } from './periodical.component';

describe('PeriodicalComponent', () => {
  let component: PeriodicalComponent;
  let fixture: ComponentFixture<PeriodicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeriodicalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeriodicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
