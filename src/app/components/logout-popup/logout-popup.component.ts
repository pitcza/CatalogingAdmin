import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-logout-popup',
  templateUrl: './logout-popup.component.html',
  styleUrl: './logout-popup.component.scss'
})
export class LogoutPopupComponent {
  
  @Output() leaveClicked = new EventEmitter<void>();
  @Output() closedPopup = new EventEmitter<void>();

  close() {
    this.closedPopup.emit();
  }

  onLeaveClick() {
    this.leaveClicked.emit();
  }
}
