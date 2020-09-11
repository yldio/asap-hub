import React from 'react';
import { render } from '@testing-library/react';

import NetworkPeople from '../NetworkPeople';

const person = {
  id: '55724942-3408-4ad6-9a73-14b92226ffb6',
  createdDate: '2020-09-07T17:36:54Z',
  lastModifiedDate: '2020-09-07T17:36:54Z',
  displayName: 'Person A',
  email: 'agnete.kirkeby@sund.ku.dk',
  firstName: 'Agnete',
  middleName: '',
  lastName: 'Kirkeby',
  jobTitle: 'Assistant Professor',
  institution: 'University of Copenhagen',
  teams: [
    {
      id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
      displayName: 'Jakobsson, J',
      role: 'Core Leadership - Co-Investigator',
    },
  ],
  orcid: '0000-0001-8203-6901',
  orcidWorks: [],
  skills: [],
  profileHref: 'wrong',
};
const people = [person, { ...person, id: '43', displayName: 'Person B' }];

it('renders multiple people cards', () => {
  const { queryAllByRole } = render(<NetworkPeople people={people} />);
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Person A', 'Person B']);
});
