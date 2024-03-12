import { LabeledTypeahead } from '@asap-hub/react-components';
import { boolean, number, text } from './knobs';

export default {
  title: 'Molecules / Labeled Typeahead',
  component: LabeledTypeahead,
};

export const Normal = () => (
  <LabeledTypeahead
    title={text('Title', 'Airport')}
    subtitle={text('Subtitle', '(Required)')}
    suggestions={['LHR', 'LGW', 'STN', 'LTN', 'LCY', 'SEN']}
    value="LHR"
    enabled={boolean('Enabled', true)}
    maxLength={number('Maximum length', 100)}
  />
);

export const Invalid = () => (
  <LabeledTypeahead
    title={text('Title', 'Airport')}
    subtitle={text('Subtitle', '(Required)')}
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
  (options: string[]) =>
  (inputValue = ''): Promise<string[]> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          options.filter((i) =>
            i.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        );
      }, 2000);
    });

export const Async = () => (
  <LabeledTypeahead
    title={text('Title', 'Airport')}
    subtitle={text('Subtitle', '(Required)')}
    loadOptions={loadOptionsMock(['LHR', 'LGW', 'STN', 'LTN', 'LCY', 'SEN'])}
    value=""
    enabled={boolean('Enabled', true)}
  />
);
