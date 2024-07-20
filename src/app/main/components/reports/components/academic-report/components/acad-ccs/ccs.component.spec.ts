import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcsComponent } from './ccs.component';

describe('CcsComponent', () => {
  let component: CcsComponent;
  let fixture: ComponentFixture<CcsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CcsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CcsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
