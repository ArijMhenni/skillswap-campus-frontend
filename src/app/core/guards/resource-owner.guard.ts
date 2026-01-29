import { inject } from '@angular/core';
import { Router, ActivatedRouteSnapshot, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { SkillService } from '../../features/skills/services/skill.service';
import { map, catchError, of } from 'rxjs';

/**
 * Guard to check if the current user is the owner of a skill resource.
 * This guard can be used in two ways:
 * 1. As a canActivate guard to prevent non-owners from accessing edit routes
 * 2. With canMatch to conditionally load components based on ownership
 */
export const skillOwnerGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const skillService = inject(SkillService);
  const router = inject(Router);

  const skillId = route.paramMap.get('id');
  const currentUser = authService.getCurrentUser();

  if (!skillId || !currentUser) {
    return router.createUrlTree(['/skills']);
  }

  // Fetch the skill and check ownership
  return skillService.getSkillById(skillId).pipe(
    map(skill => {
      const isOwner = skill.user?.id === currentUser.id;
      
      // Store ownership status in route data for component access
      route.data = { ...route.data, isOwner, skill };
      
      // If this is an edit route, only allow owners
      if (route.routeConfig?.path?.includes('edit') && !isOwner) {
        alert('Vous n\'êtes pas autorisé à modifier cette compétence.');
        return router.createUrlTree(['/skills', skillId]);
      }
      
      return true;
    }),
    catchError(() => {
      // If skill not found or error, redirect to skills list
      return of(router.createUrlTree(['/skills']));
    })
  );
};

/**
 * Simplified version for quick ownership check without loading the full skill
 * Useful when you already have the skill data loaded
 */
export const requireSkillOwner: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const skillId = route.paramMap.get('id');
  const currentUser = authService.getCurrentUser();

  if (!currentUser) {
    return router.createUrlTree(['/auth/login']);
  }

  // This assumes skill data is already available in parent route
  // For edit operations, use the full skillOwnerGuard instead
  return true;
};
