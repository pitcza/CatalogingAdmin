import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofprojectsComponent } from './listofprojects.component';

describe('ListofprojectsComponent', () => {
  let component: ListofprojectsComponent;
  let fixture: ComponentFixture<ListofprojectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListofprojectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListofprojectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
