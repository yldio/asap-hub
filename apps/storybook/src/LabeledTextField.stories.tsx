import { boolean, text } from '@storybook/addon-knobs';

import { GlobeIcon, LabeledTextField } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Labeled Text Field',
  component: LabeledTextField,
};

export const AllLabels = () => (
  <LabeledTextField
    title={text('Title', 'Full Name')}
    subtitle={text('Subtitle', '(Required)')}
    description={text('Description', 'As stated on passport')}
    value={text('Value', 'John Doe')}
    hint={text(
      'Hint',
      "Hint: Must not include special characters, such as '|' and '%'.",
    )}
  />
);
export const Empty = () => (
  <LabeledTextField
    title="Full Name"
    subtitle={text('Subtitle', '')}
    value=""
    placeholder={text('Placeholder', '')}
  />
);
export const Disabled = () => (
  <LabeledTextField
    title="Full Name"
    subtitle={text('Subtitle', '(Required)')}
    value={text('Value', 'John Doe')}
    enabled={false}
  />
);

export const Invalid = () => (
  <LabeledTextField
    title={text('Title', 'Full Name')}
    subtitle={text('Subtitle', '(Required)')}
    value={text('Value', 'John|Doe')}
    customValidationMessage={text(
      'Validation Error Message',
      "Must not include special characters, such as '|' and '%'.",
    )}
    hint={text('Hint', 'Hint')}
  />
);

export const LabelIndicator = () => (
  <LabeledTextField
    title={text('Title', 'Twitter')}
    subtitle={text('Subtitle', '(Required)')}
    value={text('Value', 'handle')}
    enabled={boolean('Enabled', true)}
    hint={text('Hint', '')}
    customValidationMessage={
      boolean('Valid', true)
        ? undefined
        : 'I am a long error message here for example'
    }
    labelIndicator={
      boolean('Icon', false) ? <GlobeIcon /> : text('Label Indicator', '@')
    }
  />
);
