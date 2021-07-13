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

export const loadOptionsMock =
  (options: string[], delay = 2000) =>
  (inputValue = ''): Promise<string[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          options.filter((i) =>
            i.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        );
      }, delay);
    });

export const Async = () => {
  const delay = number('Delay(ms)', 2000);
  return (
    <LabeledTypeahead
      title={text('Title', 'Airport')}
      loadOptions={loadOptionsMock(
        ['LHR', 'LGW', 'STN', 'LTN', 'LCY', 'SEN'],
        delay,
      )}
      value=""
      enabled={boolean('Enabled', true)}
    />
  );
};
