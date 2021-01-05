import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import UserProfileStaff from '../UserProfileStaff';

const boilerplateProps: ComponentProps<typeof UserProfileStaff> = {
  firstName: 'John',
  teams: [],
  email: 'test@test.com',
  questions: [],
  skills: [],
  discoverHref: '/discover',
};

it('renders the biography', () => {
  const { getByText } = render(
    <UserProfileStaff {...boilerplateProps} biography={'Text content'} />,
  );

  expect(getByText(/biography/i)).toBeVisible();
  expect(getByText('Text content')).toBeVisible();
});

it('renders skills section', () => {
  const { getByText } = render(
    <UserProfileStaff {...boilerplateProps} skills={['skill a']} />,
  );

  expect(getByText('Expertise and Resources')).toBeVisible();
  expect(getByText(/skill.a/i)).toBeVisible();
});

it('renders questions section', () => {
  const { getByText } = render(
    <UserProfileStaff {...boilerplateProps} questions={['question 1']} />,
  );

  expect(getByText(/open\squestions/i)).toBeVisible();
  expect(getByText(/question.1/i)).toBeVisible();
});

it('renders orcid section', () => {
  const { getByText } = render(
    <UserProfileStaff
      {...boilerplateProps}
      orcidWorks={[
        {
          title: 'Title',
          type: 'BOOK' as const,
          publicationDate: {
            year: '2020',
            month: '05',
            day: '12',
          },
          lastModifiedDate: '1478865224685',
        },
      ]}
    />,
  );

  expect(getByText(/recent/i)).toBeVisible();
});

it('renders teams section', () => {
  const { getByText } = render(
    <UserProfileStaff {...boilerplateProps} responsibilities={'responsible'} />,
  );

  expect(getByText(/role\son\sasap/i)).toBeVisible();
  expect(getByText(/responsible/i)).toBeVisible();
});

it('renders extra teams section', () => {
  const { getByText } = render(
    <UserProfileStaff
      {...boilerplateProps}
      responsibilities={'responsible'}
      teams={[
        {
          id: 'uuid',
          displayName: 'Awesome',
          role: 'Project Manager',
          href: '/uuid',
        },
      ]}
    />,
  );

  expect(getByText(/team\sawesome/i)).toBeVisible();
  expect(getByText(/responsible/i)).toBeVisible();
});
