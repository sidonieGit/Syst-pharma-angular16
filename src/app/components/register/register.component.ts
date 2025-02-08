import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Client } from 'src/app/model/client';
import { AuthService, UserRole } from 'src/app/services/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent {
  UserRole = UserRole; // Pour utiliser l'enum UserRole dans le template

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
      role: [UserRole.Client], // Rôle par défaut pour le client
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
      : { mismatch: true };
  }

  onRegisterSubmit(): void {
    if (this.registerForm.valid) {
      const { confirmPassword, ...userData } = this.registerForm.value; // Extrait les propriétés de userData qui ne sont pas confirmPassword

      if (this.authService.register(userData as Client)) {
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
