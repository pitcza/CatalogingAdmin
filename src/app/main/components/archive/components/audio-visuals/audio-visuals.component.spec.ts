import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioVisualsComponent } from './audio-visuals.component';

describe('AudioVisualsComponent', () => {
  let component: AudioVisualsComponent;
  let fixture: ComponentFixture<AudioVisualsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioVisualsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudioVisualsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
