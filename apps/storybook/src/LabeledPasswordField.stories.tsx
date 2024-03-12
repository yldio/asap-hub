import { LabeledPasswordField } from '@asap-hub/react-components';

import { text } from './knobs';

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
export const Invalid = () => (
  <LabeledPasswordField
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
