import { AbstractControl, ValidatorFn } from '@angular/forms';

/* 
## USAGE

-- Custom validators for reactive forms. Just call them like Validators.something, pass the function instead.
-- Don't forget to import! Though angular has auto import
*/

// Check if the value is of type date
export function pastDateValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {
    const date = new Date(control.value);
    if (isNaN(date.getTime())) {
      // Invalid date format
      return { 'invalidDate': true };
    }

    const today = new Date();
    if (date >= today) {
      // Date is not in the past
      return { 'notPastDate': true };
    }
    
    return null;
  };
}

export function numberAndGreaterThanValidator(num: number): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    const value = control.value;

    if (value !== null && value !== undefined && !isNaN(value) && +value > num) {
      return null; // Valid case
    }

    return { 'greaterThan': { valid: false, requiredValue: num, actualValue: value } };
  };
}