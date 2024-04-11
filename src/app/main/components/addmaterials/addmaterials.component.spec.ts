import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddmaterialsComponent } from './addmaterials.component';

describe('AddmaterialsComponent', () => {
  let component: AddmaterialsComponent;
  let fixture: ComponentFixture<AddmaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddmaterialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddmaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
