import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-cancel-popup',
  templateUrl: './cancel-popup.component.html',
  styleUrl: './cancel-popup.component.scss'
})
export class CancelPopupComponent {
  @Output() yesClicked = new EventEmitter<void>();
  @Output() closedPopup = new EventEmitter<void>();

  close() {
    this.closedPopup.emit();
  }

  onYesClick() {
    this.yesClicked.emit();
  }
}