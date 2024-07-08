import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewAVComponent } from './view-av.component';

describe('ViewAVComponent', () => {
  let component: ViewAVComponent;
  let fixture: ComponentFixture<ViewAVComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ViewAVComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ViewAVComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
