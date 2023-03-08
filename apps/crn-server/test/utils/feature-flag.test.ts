import { FeatureFlagDependencySwitch } from '../../src/utils/feature-flag';
import { userDataProviderMock } from '../mocks/user-data-provider.mock';

describe('Feature Flag Dependency Switch', () => {
  test('Should throw when resolving a dependency that is not bound for both true and false values of the feature flag', () => {
    const featureFlagDependencySwitch = new FeatureFlagDependencySwitch();
    featureFlagDependencySwitch.setDependency(
      'users',
      userDataProviderMock,
      'IS_CONTENTFUL_ENABLED',
      false,
    );
    expect(() =>
      featureFlagDependencySwitch.getDependency(
        'users',
        'IS_CONTENTFUL_ENABLED',
      ),
    ).toThrowError();
  });

  test('Should throw when invoking a method on a dependency that was unbound', () => {
    const featureFlagDependencySwitch = new FeatureFlagDependencySwitch();
    featureFlagDependencySwitch.setDependency(
      'users',
      userDataProviderMock,
      'IS_CONTENTFUL_ENABLED',
      false,
    );
    featureFlagDependencySwitch.setDependency(
      'users',
      userDataProviderMock,
      'IS_CONTENTFUL_ENABLED',
      true,
    );
    const dependency = featureFlagDependencySwitch.getDependency(
      'users',
      'IS_CONTENTFUL_ENABLED',
    );
    featureFlagDependencySwitch.setDependency(
      'users',
      undefined,
      'IS_CONTENTFUL_ENABLED',
      true,
    );

    featureFlagDependencySwitch.setFeatureFlag('IS_CONTENTFUL_ENABLED', true);
    expect(() => dependency.fetch({})).toThrowError();
  });

  test('Should bind a depedency, call its method, do a feature flag switch and call the same method again to confirm it was called on both bound dependencies', async () => {
    const featureFlagDependencySwitch = new FeatureFlagDependencySwitch();

    // Create two dependencies for the same feature flag one for true and one for false
    const userDataProviderMockTrue = Object.create({
      ...userDataProviderMock,
      fetch: jest.fn(),
    });
    const userDataProviderMockFalse = Object.create({
      ...userDataProviderMock,
      fetch: jest.fn(),
    });
    featureFlagDependencySwitch.setDependency(
      'users',
      userDataProviderMockTrue,
      'IS_CONTENTFUL_ENABLED',
      true,
    );
    featureFlagDependencySwitch.setDependency(
      'users',
      userDataProviderMockFalse,
      'IS_CONTENTFUL_ENABLED',
      false,
    );

    // Set the current feature flag to false
    featureFlagDependencySwitch.setFeatureFlag('IS_CONTENTFUL_ENABLED', false);

    // Get the dependency
    const userDataProvider = featureFlagDependencySwitch.getDependency(
      'users',
      'IS_CONTENTFUL_ENABLED',
    );

    // Assert that the method was called on the correct dependency
    expect(userDataProviderMockFalse.fetch).not.toHaveBeenCalled();
    await userDataProvider.fetch({});
    expect(userDataProviderMockFalse.fetch).toHaveBeenCalled();

    // Switch the feature flag to true
    featureFlagDependencySwitch.setFeatureFlag('IS_CONTENTFUL_ENABLED', true);

    // Assert that the method was called on the other dependency after the switch
    expect(userDataProviderMockTrue.fetch).not.toHaveBeenCalled();
    await userDataProvider.fetch({});
    expect(userDataProviderMockTrue.fetch).toHaveBeenCalled();
  });
});
