import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Angular Test Demo';
  userForm: FormGroup;
  submitted = false;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group(
      {
        name: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        deposit: [0, [Validators.required, Validators.min(0)]],
        isOldCustomer: [false],
        customerId: ['']
      },
      { validators: this.passwordMatchValidator } // custom validator at form group level
    );

    // Dynamically validate customerId when isOldCustomer is checked
    this.userForm.get('isOldCustomer')?.valueChanges.subscribe((isOld: boolean) => {
      const customerIdControl = this.userForm.get('customerId');
      if (isOld) {
        customerIdControl?.setValidators([Validators.required]);
      } else {
        customerIdControl?.clearValidators();
      }
      customerIdControl?.updateValueAndValidity();
    });
  }

  // ✅ Custom Validator for password match
  passwordMatchValidator(control: AbstractControl) {
    const password = control.get('password')?.value;
    const confirmPassword = control.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.valid) {
      console.log('Form Submitted', this.userForm.value);
    }
  }

  resetForm() {
    this.userForm.reset();
    this.submitted = false;
  }
}
