import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeletematPopupComponent } from './deletemat-popup.component';

describe('DeletematPopupComponent', () => {
  let component: DeletematPopupComponent;
  let fixture: ComponentFixture<DeletematPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeletematPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeletematPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
