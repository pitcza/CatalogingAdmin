import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GcComponent } from './gc.component';

describe('GcComponent', () => {
  let component: GcComponent;
  let fixture: ComponentFixture<GcComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GcComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
