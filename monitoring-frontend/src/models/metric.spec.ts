import { Metric } from './metric';

describe('Metric', () => {
  it('should create an instance', () => {
    expect(new Metric('id', 'name', 0, 'date', 1, 'taskId')).toBeTruthy();
  });
});
