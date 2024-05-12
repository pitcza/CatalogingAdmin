import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CbaComponent } from './cba.component';

describe('CbaComponent', () => {
  let component: CbaComponent;
  let fixture: ComponentFixture<CbaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CbaComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CbaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
