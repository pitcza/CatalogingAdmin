import { Component, EventEmitter, OnDestroy, Output } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss',
})
export class ChangePasswordComponent implements OnDestroy {
  constructor(
    private fb: FormBuilder,
    private as: AuthService,
  ) {}
  @Output() closed = new EventEmitter<void>();

  form = this.fb.group({
    old_password: ['', [Validators.required]],
    new_password: ['', [Validators.required, Validators.minLength(8)]],
    new_password_confirmation: [
      '',
      [Validators.required, Validators.minLength(8)],
    ],
  });

  showPassword = {
    old: false,
    new: false,
    confirm: false,
  };

  showInvalidNote() {
    if (
      this.form.get('old_password')?.invalid &&
      this.form.get('old_password')?.touched
    ) {
      return 'Old password is required';
    } else if (
      this.form.get('new_password')?.invalid &&
      this.form.get('new_password')?.touched
    ) {
      return 'New password must be at least 8 characters long';
    } else if (
      this.form.get('new_password_confirmation')?.value !==
      this.form.get('new_password')?.value
    ) {
      return 'Passwords do not match';
    } else {
      return '';
    }
  }

  isDiffPassword() {
    return (
      this.form.get('new_password')?.value !==
      this.form.get('new_password_confirmation')?.value
    );
  }

  togglePasswordVisibility(field: 'old' | 'new' | 'confirm') {
    this.showPassword[field] = !this.showPassword[field];
  }

  submit() {
    if (this.form.valid) {
      this.as.changePassword(this.form.value).subscribe({
        next: (res: any) => {
          Swal.fire({
            title: 'Password Changed Successfully!',
            text: 'Your password has been updated.',
            icon: 'success',
            confirmButtonText: 'Close',
            confirmButtonColor: '#777777',
            scrollbarPadding: false,
          });
          this.close();
        },
        error: (err) => {
          Swal.fire({
            title: 'Error',
            text: err.message || 'Failed to change password',
            icon: 'error',
            confirmButtonText: 'Close',
            confirmButtonColor: '#777777',
            scrollbarPadding: false,
          });
        },
      });
    } else {
      console.error('Form is invalid');
    }
  }

  close() {
    this.closed.emit();
  }

  ngOnDestroy(): void {
    this.close();
  }
}
