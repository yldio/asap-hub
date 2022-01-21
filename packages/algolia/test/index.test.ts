import { algoliasearch, algoliasearchLite } from '../src/index';

describe('ASAP Hub Algolia package', () => {
  it('should expose algoliasearch', () => {
    expect(algoliasearch).toBeInstanceOf(Function);
  });

  it('should expose algoliasearchLite', () => {
    expect(algoliasearchLite).toBeInstanceOf(Function);
  });
});
