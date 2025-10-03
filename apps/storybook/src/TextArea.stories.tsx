import { TextArea } from '@asap-hub/react-components';

import { text, boolean, number } from './knobs';

export default {
  title: 'Atoms / Text Area',
  component: TextArea,
};

export const Normal = () => (
  <TextArea
    value={text('Value', 'This is some text content')}
    placeholder={text('Placeholder', 'Enter text here...')}
    enabled={boolean('Enabled', true)}
    required={boolean('Required', false)}
    maxLength={number('Max Length', 500)}
    customValidationMessage={text('Validation Message', '')}
  />
);

export const Disabled = () => (
  <TextArea value="This textarea is disabled" enabled={false} />
);

export const WithExtras = () => (
  <TextArea
    value="Textarea with extra content below"
    extras={<span>Additional information or helper text</span>}
    maxLength={100}
    customValidationMessage="This field has an error"
  />
);

export const MaxLengthReached = () => {
  const maxLen = 44;
  return (
    <TextArea
      value="This text is exactly at the character limit!"
      maxLength={maxLen}
    />
  );
};
