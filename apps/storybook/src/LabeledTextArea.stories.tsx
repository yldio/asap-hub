import { text, array, number } from '@storybook/addon-knobs';

import { LabeledTextArea } from '@asap-hub/react-components';

export default {
  title: 'Molecules / Labeled Text Area',
  component: LabeledTextArea,
};

export const AllLabels = () => (
  <LabeledTextArea
    title={text('Title', 'Members')}
    tip={text('Tip', 'Tip: One member name per line')}
    value={array('Value', ['John Doe', 'Bat Man'], '\n').join('\n')}
  />
);
export const Empty = () => (
  <LabeledTextArea
    title="Members"
    value=""
    placeholder={array(
      'Placeholder',
      ['Member 1', 'Member 2', '...'],
      '\n',
    ).join('\n')}
  />
);
export const Disabled = () => (
  <LabeledTextArea title="Members" value="" enabled={false} />
);
export const Invalid = () => (
  <LabeledTextArea
    title="Members"
    value={'John Doe\nBat Man'}
    customValidationMessage={text(
      'Validation Error Message',
      'Must have at least 3 members.',
    )}
  />
);
export const MaxLength = () => {
  const value = 'John Doe';
  return (
    <LabeledTextArea
      title="Members"
      value={value}
      maxLength={number('Maximum length', value.length, { min: value.length })}
    />
  );
};
