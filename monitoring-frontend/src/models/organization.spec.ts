import { Organization } from './organization';

describe('Organization', () => {
  it('should create an instance', () => {
    expect(new Organization('id', 'name', 'streetAddress', 'user')).toBeTruthy();
  });
});
