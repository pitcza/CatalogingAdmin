import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-details-popup',
  templateUrl: './details-popup.component.html',
  styleUrl: './details-popup.component.scss'
})
export class DetailsPopupComponent {
  @Output() editClicked = new EventEmitter<void>();
  @Output() deleteClicked = new EventEmitter<void>();
  @Output() closedPopup = new EventEmitter<void>();

  onEditClick() {
    this.editClicked.emit();
  }
  
  onDeleteClick() {
    this.deleteClicked.emit();
  }

  close() {
    this.closedPopup.emit();
  }
}
