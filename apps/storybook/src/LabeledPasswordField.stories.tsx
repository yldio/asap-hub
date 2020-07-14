import React from 'react';
import { text } from '@storybook/addon-knobs';

import { LabeledPasswordField } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Auth / Labeled Password Field',
  component: LabeledPasswordField,
};

export const Normal = () => (
  <LabeledPasswordField
    title={text('Title', 'Password')}
    value={text('Value', "_%6.o*fGR75)':7,")}
    forgotPasswordHref={text(
      'Forgot Password Link',
      'https://en.wikipedia.org/wiki/Password',
    )}
  />
);
export const Empty = () => (
  <LabeledPasswordField
    value=""
    forgotPasswordHref={text(
      'Forgot Password Link',
      'https://en.wikipedia.org/wiki/Password',
    )}
    placeholder={text('Placeholder', '')}
  />
);
export const Invalid = () => {
  return (
    <LabeledPasswordField
      title='Password - will only indicate invalidity after losing focus the first time or pressing the "Validate Form" knob.'
      value={text('Value', "_%6.o*fGR75)':7,")}
      forgotPasswordHref={text(
        'Forgot Password Link',
        'https://en.wikipedia.org/wiki/Password',
      )}
      customValidationMessage={text(
        'Validation Error Message',
        'This does not look correct.',
      )}
    />
  );
};
