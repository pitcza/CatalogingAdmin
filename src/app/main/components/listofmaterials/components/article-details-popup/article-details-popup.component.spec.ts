import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArticleDetailsPopupComponent } from './article-details-popup.component';

describe('ArticleDetailsPopupComponent', () => {
  let component: ArticleDetailsPopupComponent;
  let fixture: ComponentFixture<ArticleDetailsPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ArticleDetailsPopupComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ArticleDetailsPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
