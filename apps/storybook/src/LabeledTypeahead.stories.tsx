import { LabeledTypeahead } from '@asap-hub/react-components';
import { boolean, number, text } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Labeled Typeahead',
  component: LabeledTypeahead,
};

export const Normal = () => (
  <LabeledTypeahead
    title={text('Title', 'Airport')}
    suggestions={['LHR', 'LGW', 'STN', 'LTN', 'LCY', 'SEN']}
    value="LHR"
    enabled={boolean('Enabled', true)}
    maxLength={number('Maximum length', 100)}
  />
);

export const Invalid = () => (
  <LabeledTypeahead
    title={text('Title', 'Airport')}
    suggestions={['LHR', 'LGW', 'STN', 'LTN', 'LCY', 'SEN']}
    value="LHR"
    enabled={boolean('Enabled', true)}
    customValidationMessage={text(
      'Validation Error Message',
      'This airport is currently closed.',
    )}
  />
);
