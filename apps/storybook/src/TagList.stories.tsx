import { TagList } from '@asap-hub/react-components';
import { array, boolean, number } from '@storybook/addon-knobs';

export default {
  title: 'Molecules / Tag List',
};

export const Normal = () => (
  <TagList
    min={number('Minimum number of tags shown on mobile', 3)}
    max={number('Maximum number of tags shown on desktop', 5)}
    enabled={boolean('Enabled', true)}
    tags={array('Tags', [
      'Neurological Diseases',
      'Clinical Neurology',
      'Adult Neurology',
      'Neuroimaging',
      'Neurologic Examination',
      'Neuroprotection',
      'Movement Disorders',
      'Neurodegenerative Diseases',
      'Neurological Diseases',
    ])}
  />
);

export const LinkTagList = () => (
  <TagList
    min={number('Minimum number of tags shown on mobile', 3)}
    max={number('Maximum number of tags shown on desktop', 5)}
    enabled={boolean('Enabled', true)}
    tags={[
      { tag: 'Neurological Diseases', href: '#' },
      { tag: 'Clinical Neurology', href: '#' },
      { tag: 'Adult Neurology', href: '#' },
      { tag: 'Neuroimaging', href: '#' },
      { tag: 'Neurologic Examination', href: '#' },
      { tag: 'Neuroprotection', href: '#' },
      { tag: 'Movement Disorders', href: '#' },
      { tag: 'Neurodegenerative Diseases', href: '#' },
      { tag: 'Neurological Diseases', href: '#' },
    ]}
  />
);
