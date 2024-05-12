import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CahsComponent } from './cahs.component';

describe('CahsComponent', () => {
  let component: CahsComponent;
  let fixture: ComponentFixture<CahsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CahsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CahsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
