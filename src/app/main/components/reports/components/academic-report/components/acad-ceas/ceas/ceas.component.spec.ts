import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CeasComponent } from './ceas.component';

describe('CeasComponent', () => {
  let component: CeasComponent;
  let fixture: ComponentFixture<CeasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CeasComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CeasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
