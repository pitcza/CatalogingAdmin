import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportProjectsComponent } from './import-projects.component';

describe('ImportProjectsComponent', () => {
  let component: ImportProjectsComponent;
  let fixture: ComponentFixture<ImportProjectsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ImportProjectsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ImportProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
