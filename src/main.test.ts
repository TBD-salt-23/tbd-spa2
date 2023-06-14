import { listOfMockImages } from './testThing';

describe('array', () => {
  it('should test whether the array contains something', () => {
    expect(listOfMockImages.length).toBeGreaterThan(0);
  });
});
