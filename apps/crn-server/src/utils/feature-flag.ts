import { TeamDataProvider } from '../data-providers/teams.data-provider';
import { UserDataProvider } from '../data-providers/users.data-provider';

const featureFlags = ['IS_CONTENTFUL_ENABLED_V2'] as const;
type FeatureFlag = (typeof featureFlags)[number];

type DependencySwitch<T> = {
  true?: T;
  false?: T;
};

type DependencyList = {
  users: DependencySwitch<UserDataProvider>;
  teams: DependencySwitch<TeamDataProvider>;
};

export class FeatureFlagDependencySwitch {
  private dependencies: {
    [key in FeatureFlag]: DependencyList;
  } = {
    IS_CONTENTFUL_ENABLED_V2: {
      users: {
        true: undefined,
        false: undefined,
      },
      teams: {
        true: undefined,
        false: undefined,
      },
    },
  };

  private featureFlags: {
    [key in FeatureFlag]: boolean;
  } = {
    IS_CONTENTFUL_ENABLED_V2: false,
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
