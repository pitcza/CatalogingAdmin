import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AcademicprojectsComponent } from './academicprojects.component';

describe('AcademicprojectsComponent', () => {
  let component: AcademicprojectsComponent;
  let fixture: ComponentFixture<AcademicprojectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AcademicprojectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AcademicprojectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
