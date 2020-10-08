import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import NetworkPeople from '../NetworkPeople';

const person: ComponentProps<typeof NetworkPeople>['people'][0] = {
  id: '55724942-3408-4ad6-9a73-14b92226ffb6',
  createdDate: '2020-09-07T17:36:54Z',
  displayName: 'Person A',
  firstName: 'Agnete',
  lastName: 'Kirkeby',
  jobTitle: 'Assistant Professor',
  institution: 'University of Copenhagen',
  teams: [
    {
      id: 'e12729e0-a244-471f-a554-7b58eae83a8d',
      displayName: 'Jakobsson, J',
      role: 'Core Leadership - Co-Investigator',
      href: '/teams/somewhere',
    },
  ],
  href: '/users/somewhere',
};
const people = [person, { ...person, id: '43', displayName: 'Person B' }];
const props: ComponentProps<typeof NetworkPeople> = {
  people,
  numberOfItems: people.length,
  numberOfPages: 1,
  currentPageIndex: 0,
  renderPageHref: (index) => `#${index}`,
};

it('renders multiple people cards', () => {
  const { queryAllByRole } = render(<NetworkPeople {...props} />);
  expect(
    queryAllByRole('heading').map(({ textContent }) => textContent),
  ).toEqual(['Person A', 'Person B']);
});
