import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListofmaterialsComponent } from './listofmaterials.component';

describe('ListofmaterialsComponent', () => {
  let component: ListofmaterialsComponent;
  let fixture: ComponentFixture<ListofmaterialsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListofmaterialsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ListofmaterialsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
