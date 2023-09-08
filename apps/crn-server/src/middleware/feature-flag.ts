import { Request, Response, NextFunction } from 'express';
import { FeatureFlagDependencySwitch } from '../utils/feature-flag';

export const featureFlagMiddlewareFactory =
  (_featureFlagDependencySwitch: FeatureFlagDependencySwitch) =>
  (req: Request, res: Response, next: NextFunction): void => {
    // example feature flag
    // _featureFlagDependencySwitch.setFeatureFlag('PERSISTENT_EXAMPLE', true);
    next();
  };
