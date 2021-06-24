import { LabeledMultiSelect } from '@asap-hub/react-components';
import { text } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Labeled Multi Select',
  component: LabeledMultiSelect,
};

export const Normal = () => (
  <LabeledMultiSelect
    title={text('Title', 'Tags')}
    subtitle={text(
      'Subtitle',
      'Select the keywords that best apply to your work. Please add a minimum of 5 tags.',
    )}
    placeholder={text('Placeholder', 'Add a tag (E.g. Cell Biology)')}
    suggestions={[
      'Neurological Diseases',
      'Cell Biology',
      'Clinical Neurology',
      'Neuroimaging',
      'Neurologic Examination',
      'Neuroprotection',
      'Movement Disorders',
    ]}
    values={['Neurological Diseases', 'Cell Biology', 'Clinical Neurology']}
    noOptionsMessage={() => text('No Options Message', 'No options!')}
  />
);

export const Invalid = () => (
  <LabeledMultiSelect
    title={text('Title', 'Airport')}
    subtitle={text('Subtitle', 'Pick some airports')}
    suggestions={['LHR', 'LGW', 'STN', 'LTN', 'LCY', 'SEN']}
    values={[]}
    placeholder={text('Placeholder', 'Please select some airports')}
    customValidationMessage={text(
      'Validation Error Message',
      'This airport is currently closed.',
    )}
  />
);
