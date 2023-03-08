import { Request, Response, NextFunction } from 'express';
import { isContentfulEnabledV2 } from '../config';
import { FeatureFlagDependencySwitch } from '../utils/feature-flag';

export const featureFlagMiddlewareFactory =
  (featureFlagDependencySwitch: FeatureFlagDependencySwitch) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.headers['x-contentful-enabled']) {
      featureFlagDependencySwitch.setFeatureFlag(
        'IS_CONTENTFUL_ENABLED',
        req.headers['x-contentful-enabled'] === 'true',
      );
    } else {
      featureFlagDependencySwitch.setFeatureFlag(
        'IS_CONTENTFUL_ENABLED',
        isContentfulEnabledV2,
      );
    }
    return next();
  };
