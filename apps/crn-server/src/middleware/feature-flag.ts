import { Request, Response, NextFunction } from 'express';
import { isContentfulEnabled } from '../config';
import { FeatureFlagDependencySwitch } from '../utils/feature-flag';

export const featureFlagMiddlewareFactory =
  (featureFlagDependencySwitch: FeatureFlagDependencySwitch) =>
  (req: Request, res: Response, next: NextFunction): void => {
    featureFlagDependencySwitch.setFeatureFlag(
      'IS_CONTENTFUL_ENABLED',
      isContentfulEnabled,
    );
    return next();
  };
