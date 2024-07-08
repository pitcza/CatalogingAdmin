import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioVisualComponent } from './audio-visual.component';

describe('AudioVisualComponent', () => {
  let component: AudioVisualComponent;
  let fixture: ComponentFixture<AudioVisualComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AudioVisualComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AudioVisualComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
