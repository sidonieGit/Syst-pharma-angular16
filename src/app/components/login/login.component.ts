import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService, UserRole } from 'src/app/services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { Notification } from '../../model/notification';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent {
  forgotPasswordForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
  });

  loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService
  ) {}

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  onForgotPasswordSubmit() {
    if (this.forgotPasswordForm.valid) {
      console.log('Reset link sent to:', this.forgotPasswordForm.value.email);
      //envoye un code de reset sur le mail de l'utilisateur et lui demande de cliquer sur le lien
      //envoie un mail avec le lien de re
      //si le lien est bon, on redirige vers la page de connexion avec un message de succes
      //sinon on affiche un message d'erreur
    }
  }

  onLoginSubmit(): void {
    if (this.loginForm.valid) {
      // Utilisation de l'opérateur de coalescence nulle pour garantir que la valeur soit une chaîne
      const email = this.loginForm.get('email')?.value ?? '';
      const password = this.loginForm.get('password')?.value ?? '';

      if (this.authService.login(email, password)) {
        const currentUser = this.authService.getCurrentUser();
        // Remplacer l'alert par la notification
        this.notificationService.show('Login successful!', 'success');

        // Vérification du rôle de l'utilisateur pour la redirection
        if (currentUser) {
          switch (currentUser.role) {
            case UserRole.Admin:
              this.router.navigate(['/admin-dashboard']);
              break;
            case UserRole.Agent:
              this.router.navigate(['/pharmacy-management']);
              break;
            case UserRole.Client:
              this.router.navigate(['/home']);
              break;
            default:
              this.router.navigate(['/home']);
          }
        }
      } else {
        alert('Invalid email or password!');
      }
    } else {
      alert('Please fill in all required fields correctly.');
    }
  }
}
