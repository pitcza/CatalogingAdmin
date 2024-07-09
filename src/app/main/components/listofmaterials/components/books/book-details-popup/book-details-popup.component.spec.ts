import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookDetailsPopupComponent } from './book-details-popup.component';

describe('BookDetailsPopupComponent', () => {
  let component: BookDetailsPopupComponent;
  let fixture: ComponentFixture<BookDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookDetailsPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BookDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
