import { Request, Response, NextFunction } from 'express';
import { FeatureFlagDependencySwitch } from '../utils/feature-flag';

export const featureFlagMiddlewareFactory =
  (featureFlagDependencySwitch: FeatureFlagDependencySwitch) =>
  (req: Request, res: Response, next: NextFunction): void => {
    if (req.headers['x-contentful-enabled'] === 'true') {
      featureFlagDependencySwitch.setFeatureFlag('IS_CONTENTFUL_ENABLED', true);
    } else {
      featureFlagDependencySwitch.setFeatureFlag(
        'IS_CONTENTFUL_ENABLED',
        false,
      );
    }
    return next();
  };
