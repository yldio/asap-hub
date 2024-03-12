import { DecoratorFn } from '@storybook/react';
import { UserProfileContext } from '@asap-hub/react-context';

import { boolean } from './knobs';

export const UserProfileDecorator: DecoratorFn = (storyFn, context) => (
  <UserProfileContext.Provider
    value={{
      isOwnProfile: boolean('Own Profile', false),
    }}
  >
    {storyFn({ ...context })}
  </UserProfileContext.Provider>
);
