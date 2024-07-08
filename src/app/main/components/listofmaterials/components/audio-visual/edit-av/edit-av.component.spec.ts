import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditAVComponent } from './edit-av.component';

describe('EditAVComponent', () => {
  let component: EditAVComponent;
  let fixture: ComponentFixture<EditAVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [EditAVComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditAVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
