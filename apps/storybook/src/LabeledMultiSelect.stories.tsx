import {
  LabeledMultiSelect,
  MultiSelectOptionsType,
  OptionsType,
  searchIcon,
} from '@asap-hub/react-components';

import { number, text, boolean } from './knobs';

export default {
  title: 'Molecules / Labeled Multi Select',
  component: LabeledMultiSelect,
};

export const Normal = () => (
  <LabeledMultiSelect
    title={text('Title', 'Tags')}
    subtitle={text('Subtitle', '(Required)')}
    description={text(
      'Description',
      'Select the keywords that best apply to your work. Please add a minimum of 5 tags.',
    )}
    leftIndicator={
      boolean('Left Search Indicator', false) ? searchIcon : undefined
    }
    placeholder={text('Placeholder', 'Add a tag (E.g. Cell Biology)')}
    suggestions={[
      'Neurological Diseases',
      'Cell Biology',
      'Clinical Neurology',
      'Neuroimaging',
      'Neurologic Examination',
      'Neuroprotection',
      'Movement Disorders',
      'ARJP (Autosomal recessive juvenile parkinsonism)',
    ].map((suggestion) => ({
      label: suggestion,
      value: suggestion,
    }))}
    values={['Neurological Diseases', 'Cell Biology', 'Clinical Neurology'].map(
      (value) => ({ label: value, value }),
    )}
    noOptionsMessage={() => text('No Options Message', 'No options!')}
  />
);

export const Invalid = () => (
  <LabeledMultiSelect
    title={text('Title', 'Airport')}
    subtitle={text('Subtitle', '(Required)')}
    description={text('Description', 'Pick some airports')}
    suggestions={['LHR', 'LGW', 'STN', 'LTN', 'LCY', 'SEN'].map(
      (suggestion) => ({
        label: suggestion,
        value: suggestion,
      }),
    )}
    values={[]}
    placeholder={text('Placeholder', 'Please select some airports')}
    customValidationMessage={text(
      'Validation Error Message',
      'This airport is currently closed.',
    )}
  />
);

// eslint-disable-next-line storybook/prefer-pascal-case
export const loadOptionsMock = (suggestions: string[], delay = 2000) => {
  const options = suggestions.map((value) => ({ label: value, value }));
  return (
    inputValue = '',
  ): Promise<NonNullable<OptionsType<MultiSelectOptionsType>>> =>
    new Promise((resolve) => {
      setTimeout(() => {
        resolve(
          options.filter(({ label }) =>
            label.toLowerCase().includes(inputValue.toLowerCase()),
          ),
        );
      }, delay);
    });
};

export const Async = () => (
  <LabeledMultiSelect
    loadOptions={loadOptionsMock(
      ['LHR', 'LGW', 'STN', 'LTN', 'LCY', 'SEN'],
      number('API Delay (ms)', 1000),
    )}
    title={text('Title', 'Airport')}
    subtitle={text('Subtitle', '(Required)')}
    description={text('Description', 'Pick some airports')}
    values={[]}
    placeholder={text('Placeholder', 'Please select some airports')}
    noOptionsMessage={() => text('No Options Message', 'No options!')}
    creatable={boolean('Creatable', false)}
  />
);

export const FixedOptions = () => (
  <LabeledMultiSelect
    loadOptions={loadOptionsMock(['LHR', 'LGW', 'STN', 'LTN', 'LCY', 'SEN'], 0)}
    title={text('Title', 'Airport')}
    subtitle={text('Subtitle', '(Required)')}
    description={text('Description', 'Pick some airports')}
    values={[{ label: 'LGW', value: 'LGW', isFixed: true }]}
    placeholder={text('Placeholder', 'Please select some airports')}
    noOptionsMessage={() => text('No Options Message', 'No options!')}
  />
);
