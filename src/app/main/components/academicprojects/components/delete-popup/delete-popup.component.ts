import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-delete-popup',
  templateUrl: './delete-popup.component.html',
  styleUrl: './delete-popup.component.scss'
})
export class DeletePopupComponent {
  @Output() deleteClicked = new EventEmitter<void>();
  @Output() closedPopup = new EventEmitter<void>();

  close() {
    this.closedPopup.emit();
  }

  onDeleteClick() {
    this.deleteClicked.emit();
  }
}
