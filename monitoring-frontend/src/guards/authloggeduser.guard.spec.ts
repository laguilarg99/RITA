import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authloggeduserGuard } from './authloggeduser.guard';

describe('authloggeduserGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authloggeduserGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
