import { UserLogin } from './user';

describe('User', () => {
  it('should create an instance', () => {
    expect(new UserLogin('id', 'username', 'password')).toBeTruthy();
  });
});
