import { FeatureFlagDependencySwitch } from '../../src/utils/feature-flag';
import { getDataProviderMock } from '../mocks/data-provider.mock';

describe('Feature Flag Dependency Switch', () => {
  test('Should throw when resolving a dependency that is not bound for both true and false values of the feature flag', () => {
    const featureFlagDependencySwitch = new FeatureFlagDependencySwitch();
    featureFlagDependencySwitch.setDependency(
      'key',
      getDataProviderMock(),
      'PERSISTENT_EXAMPLE',
      false,
    );
    expect(() =>
      featureFlagDependencySwitch.getDependency('key', 'PERSISTENT_EXAMPLE'),
    ).toThrowError();
  });

  test('Should throw when invoking a method on a dependency that was unbound', () => {
    const featureFlagDependencySwitch = new FeatureFlagDependencySwitch();
    featureFlagDependencySwitch.setDependency(
      'key',
      getDataProviderMock(),
      'PERSISTENT_EXAMPLE',
      false,
    );
    featureFlagDependencySwitch.setDependency(
      'key',
      getDataProviderMock(),
      'PERSISTENT_EXAMPLE',
      true,
    );
    const dependency = featureFlagDependencySwitch.getDependency(
      'key',
      'PERSISTENT_EXAMPLE',
    );
    featureFlagDependencySwitch.setDependency(
      'key',
      undefined,
      'PERSISTENT_EXAMPLE',
      true,
    );

    featureFlagDependencySwitch.setFeatureFlag('PERSISTENT_EXAMPLE', true);
    expect(() => dependency.fetch(null)).toThrowError();
  });

  test('Should bind a depedency, call its method, do a feature flag switch and call the same method again to confirm it was called on both bound dependencies', async () => {
    const featureFlagDependencySwitch = new FeatureFlagDependencySwitch();
    const dataProviderMockFalse = getDataProviderMock();
    const dataProviderMockTrue = getDataProviderMock();

    // Create two dependencies for the same feature flag one for true and one for false
    featureFlagDependencySwitch.setDependency(
      'key',
      dataProviderMockTrue,
      'PERSISTENT_EXAMPLE',
      true,
    );
    featureFlagDependencySwitch.setDependency(
      'key',
      dataProviderMockFalse,
      'PERSISTENT_EXAMPLE',
      false,
    );

    // Set the current feature flag to false
    featureFlagDependencySwitch.setFeatureFlag('PERSISTENT_EXAMPLE', false);

    // Get the dependency
    const dataProvider = featureFlagDependencySwitch.getDependency(
      'key',
      'PERSISTENT_EXAMPLE',
    );

    // Assert that the method was called on the correct dependency
    expect(dataProviderMockFalse.fetch).not.toHaveBeenCalled();
    await dataProvider.fetch(null);
    expect(dataProviderMockFalse.fetch).toHaveBeenCalled();

    // Switch the feature flag to true
    featureFlagDependencySwitch.setFeatureFlag('PERSISTENT_EXAMPLE', true);

    // Assert that the method was called on the other dependency after the switch
    expect(dataProviderMockTrue.fetch).not.toHaveBeenCalled();
    await dataProvider.fetch(null);
    expect(dataProviderMockTrue.fetch).toHaveBeenCalled();
  });
});
