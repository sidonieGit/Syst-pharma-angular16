import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from 'src/app/model/client'; // Assurez-vous que cette interface est définie
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  registerForm = this.fb.group(
    {
      firstName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+( [a-zA-Z]+)*$/)],
      ],
      lastName: [
        '',
        [Validators.required, Validators.pattern(/^[a-zA-Z]+( [a-zA-Z]+)*$/)],
      ],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      district: ['', [Validators.required, Validators.minLength(3)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
    },
    { validators: this.passwordMatchValidator }
  );

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  get firstName() {
    return this.registerForm.get('firstName');
  }
  get lastName() {
    return this.registerForm.get('lastName');
  }
  get email() {
    return this.registerForm.get('email');
  }
  get phone() {
    return this.registerForm.get('phone');
  }
  get district() {
    return this.registerForm.get('district');
  }
  get password() {
    return this.registerForm.get('password');
  }
  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }

  // Vérifiez si les mots de passe correspondent
  passwordMatchValidator(form: any) {
    return form.get('password').value === form.get('confirmPassword').value
      ? null
      : { mismatch: true }; // Renvoie un objet avec une propriété mismatch si les mots de passe ne correspondent pas
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...clientData } = this.registerForm.value; // Extrait les propriétés de clientData qui ne sont pas confirmPassword

      if (this.authService.register(clientData as Client)) {
        alert('Registration successful!');
        this.router.navigate(['/login']);
      } else {
        alert('User already exists!');
      }
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
