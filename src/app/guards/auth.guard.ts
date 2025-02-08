import { inject } from '@angular/core';
import {
  CanActivateFn,
  Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Liste des routes accessibles sans connexion
  const publicRoutes = [
    '/home',
    '/products',
    '/assurances',
    '/help/questions-frequentes',
    '/help/nous-contacter',
  ];

  // Vérifier si la route actuelle est publique
  if (publicRoutes.includes(state.url)) {
    return true;
  }

  // Récupérer l'utilisateur et son rôle
  const user = authService.getCurrentUser();
  if (!user) {
    router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
    return false;
  }

  const role = user.role; // Supposons que `role` est stocké dans l'objet utilisateur

  // Définir les permissions par rôle
  const rolePermissions: Record<string, string[]> = {
    Client: ['/checkout', '/orders'],
    Admin: ['/admin-dashboard'],
    Agent: ['/pharmacy-management'],
  };

  // Vérifier si l'utilisateur a l'accès à la route demandée
  if (rolePermissions[role]?.includes(state.url)) {
    return true;
  }

  // Redirection vers la page d'accueil en cas d'accès refusé
  router.navigate(['/home']);
  return false;
};
