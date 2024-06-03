import { ComponentProps } from 'react';
import { PersonalInfoModal } from '@asap-hub/react-components';
import { StaticRouter } from 'react-router-dom/server';
import { loadOptionsMock } from './LabeledTypeahead.stories';

export default {
  title: 'Templates / User Profile / Personal Info Modal',
  component: PersonalInfoModal,
};

const props = (): ComponentProps<typeof PersonalInfoModal> => ({
  firstName: 'John',
  lastName: 'Doe',
  degree: 'PhD',
  jobTitle: 'Assistant Professor',
  country: 'Los Angeles',
  city: 'CA',

  loadInstitutionOptions: loadOptionsMock([
    'Institution 1',
    'Institution 2',
    'Institution 3',
  ]),
  backHref: '#',
  countrySuggestions: ['a', 'b', 'c'],
});

export const Normal = () => (
  <StaticRouter>
    <PersonalInfoModal {...props()} backHref="/wrong" />
  </StaticRouter>
);
