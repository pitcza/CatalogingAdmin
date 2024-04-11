import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PeriodicalsComponent } from './periodicals.component';

describe('PeriodicalsComponent', () => {
  let component: PeriodicalsComponent;
  let fixture: ComponentFixture<PeriodicalsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PeriodicalsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PeriodicalsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
