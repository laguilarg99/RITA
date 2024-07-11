import { Device } from './device';

describe('Device', () => {
  it('should create an instance', () => {
    expect(new Device('id', 'name', 'organizationId')).toBeTruthy();
  });
});
