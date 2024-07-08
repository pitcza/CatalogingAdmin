import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudiovisualsComponent } from './audiovisuals.component';

describe('AudiovisualsComponent', () => {
  let component: AudiovisualsComponent;
  let fixture: ComponentFixture<AudiovisualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudiovisualsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudiovisualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
