import { DataProvider } from '@asap-hub/model';

const featureFlags = ['PERSISTENT_EXAMPLE'] as const;
type FeatureFlag = (typeof featureFlags)[number];

type DependencySwitch<T> = {
  true?: T;
  false?: T;
};

type DependencyList = {
  key: DependencySwitch<DataProvider>;
};

export class FeatureFlagDependencySwitch {
  private dependencies: {
    [key in FeatureFlag]: DependencyList;
  } = {
    PERSISTENT_EXAMPLE: {
      key: {
        true: undefined,
        false: undefined,
      },
    },
  };

  private featureFlags: {
    [key in FeatureFlag]: boolean;
  } = {
    PERSISTENT_EXAMPLE: false,
  };

  setDependency<T extends keyof DependencyList>(
    key: T,
    dependency: DependencyList[T]['true' | 'false'],
    featureFlag: FeatureFlag,
    featureFlagValue: boolean,
  ) {
    this.dependencies[featureFlag][key][featureFlagValue ? 'true' : 'false'] =
      dependency;
  }

  setFeatureFlag(featureFlag: FeatureFlag, value: boolean) {
    this.featureFlags[featureFlag] = value;
  }

  getDependency<T extends keyof DependencyList>(
    key: T,
    featureFlag: FeatureFlag,
  ): NonNullable<DependencyList[T]['true' | 'false']> {
    const dependencies = this.dependencies[featureFlag][key];

    if (!dependencies.true || !dependencies.false) {
      throw new Error(
        'Dependency not bound for both values of the feature flag',
      );
    }
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const that = this;
    return new Proxy({} as NonNullable<DependencyList[T]['true' | 'false']>, {
      get(_target, property: string) {
        const isEnabled = that.featureFlags[featureFlag];
        const dependency = isEnabled ? dependencies.true : dependencies.false;

        if (!dependency) {
          throw new Error(
            `Dependency not bound for value ${isEnabled} of the feature flag`,
          );
        }

        return dependency[property as keyof typeof dependency];
      },
    });
  }
}
