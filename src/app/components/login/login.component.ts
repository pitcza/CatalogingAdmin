import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  constructor() {

  }

  showpassword = false;

  toggleShow() {
    this.showpassword = !this.showpassword
  }
}
