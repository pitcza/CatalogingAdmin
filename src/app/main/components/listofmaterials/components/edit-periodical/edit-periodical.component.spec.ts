import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPeriodicalComponent } from './edit-periodical.component';

describe('EditPeriodicalComponent', () => {
  let component: EditPeriodicalComponent;
  let fixture: ComponentFixture<EditPeriodicalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditPeriodicalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditPeriodicalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
