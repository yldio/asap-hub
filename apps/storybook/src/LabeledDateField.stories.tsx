import { text, date } from '@storybook/addon-knobs';

import { LabeledDateField } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Labeled Date Field',
  component: LabeledDateField,
};

export const Normal = () => (
  <LabeledDateField
    title={text('Title', 'Creation Date')}
    value={new Date(date('Value', new Date()))}
    max={new Date(date('Max', new Date()))}
  />
);
export const Empty = () => <LabeledDateField title="Creation Date" />;
export const Invalid = () => (
  <LabeledDateField
    title={text('Title', 'Creation Date')}
    value={new Date()}
    customValidationMessage={text(
      'Validation Error Message',
      'Creation too late.',
    )}
  />
);
