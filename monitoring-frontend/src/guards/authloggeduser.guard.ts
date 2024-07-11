import { CanActivateFn } from '@angular/router';

export const authloggeduserGuard: CanActivateFn = (route, state) => {
  const user = window.sessionStorage.getItem('auth-user');
  if (!user) {
    window.location.href = '/login';
    return false;
  }
  return true;
};
