import { Decorator } from '@storybook/react';
import { UserProfileContext } from '@asap-hub/react-context';

import { boolean } from './knobs';

export const UserProfileDecorator: Decorator = (storyFn, context) => (
  <UserProfileContext.Provider
    value={{
      isOwnProfile: boolean('Own Profile', false),
    }}
  >
    {storyFn({ ...context })}
  </UserProfileContext.Provider>
);
