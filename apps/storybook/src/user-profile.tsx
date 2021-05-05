import React from 'react';
import { DecoratorFn } from '@storybook/react';
import { boolean } from '@storybook/addon-knobs';
import { UserProfileContext } from '@asap-hub/react-context';

export const UserProfileDecorator: DecoratorFn = (storyFn, context) => (
  <UserProfileContext.Provider
    value={{
      isOwnProfile: boolean('Own Profile', false),
    }}
  >
    {storyFn({ ...context })}
  </UserProfileContext.Provider>
);
