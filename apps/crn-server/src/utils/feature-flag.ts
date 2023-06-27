import { CalendarDataProvider, EventDataProvider } from '@asap-hub/model';
import { ExternalAuthorDataProvider } from '../data-providers/external-authors.data-provider';
import { TeamDataProvider } from '../data-providers/teams.data-provider';
import {
  AssetDataProvider,
  UserDataProvider,
  InterestGroupDataProvider,
  WorkingGroupDataProvider,
  TutorialsDataProvider,
  DiscoverDataProvider,
  GuideDataProvider,
  ResearchTagDataProvider,
} from '../data-providers/types';

const featureFlags = ['IS_CONTENTFUL_ENABLED_V2'] as const;
type FeatureFlag = (typeof featureFlags)[number];

type DependencySwitch<T> = {
  true?: T;
  false?: T;
};

type DependencyList = {
  assets: DependencySwitch<AssetDataProvider>;
  users: DependencySwitch<UserDataProvider>;
  teams: DependencySwitch<TeamDataProvider>;
  externalAuthors: DependencySwitch<ExternalAuthorDataProvider>;
  interestGroups: DependencySwitch<InterestGroupDataProvider>;
  calendars: DependencySwitch<CalendarDataProvider>;
  events: DependencySwitch<EventDataProvider>;
  workingGroups: DependencySwitch<WorkingGroupDataProvider>;
  tutorials: DependencySwitch<TutorialsDataProvider>;
  discover: DependencySwitch<DiscoverDataProvider>;
  guide: DependencySwitch<GuideDataProvider>;
  researchTags: DependencySwitch<ResearchTagDataProvider>;
};

export class FeatureFlagDependencySwitch {
  private dependencies: {
    [key in FeatureFlag]: DependencyList;
  } = {
    IS_CONTENTFUL_ENABLED_V2: {
      assets: {
        true: undefined,
        false: undefined,
      },
      users: {
        true: undefined,
        false: undefined,
      },
      teams: {
        true: undefined,
        false: undefined,
      },
      externalAuthors: {
        true: undefined,
        false: undefined,
      },
      interestGroups: {
        true: undefined,
        false: undefined,
      },
      calendars: {
        true: undefined,
        false: undefined,
      },
      events: {
        true: undefined,
        false: undefined,
      },
      workingGroups: {
        true: undefined,
        false: undefined,
      },
      tutorials: {
        true: undefined,
        false: undefined,
      },
      discover: {
        true: undefined,
        false: undefined,
      },
      guide: {
        true: undefined,
        false: undefined,
      },
      researchTags: {
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
