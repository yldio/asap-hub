import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import ProfileStaff from '../ProfileStaff';

const boilerplateProps: ComponentProps<typeof ProfileStaff> = {
  firstName: 'John',
  teams: [],
  email: 'test@test.com',
  questions: [],
  skills: [],
};

it('renders the biography', () => {
  const { getByText } = render(
    <ProfileStaff {...boilerplateProps} biography={'Text content'} />,
  );

  expect(getByText(/biography/i)).toBeVisible();
  expect(getByText('Text content')).toBeVisible();
});

it('renders skills section', () => {
  const { getByText } = render(
    <ProfileStaff {...boilerplateProps} skills={['skill a']} />,
  );

  expect(getByText('Expertise and Resources')).toBeVisible();
  expect(getByText(/skill.a/i)).toBeVisible();
});

it('renders questions section', () => {
  const { getByText } = render(
    <ProfileStaff {...boilerplateProps} questions={['question 1']} />,
  );

  expect(getByText(/open\squestions/i)).toBeVisible();
  expect(getByText(/question.1/i)).toBeVisible();
});

it('renders teams section', () => {
  const { getByText } = render(
    <ProfileStaff
      {...boilerplateProps}
      teams={[
        {
          id: '0',
          displayName: 'ASAP',
          role: 'Staff',
          href: '/discover',
          responsibilities: 'responsible',
        },
      ]}
    />,
  );

  expect(getByText(/role\son\sasap/i)).toBeVisible();
  expect(getByText(/responsible/i)).toBeVisible();
});

it('renders orcid section', () => {
  const { getByText } = render(
    <ProfileStaff
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

  expect(getByText(/recent\spublications/i)).toBeVisible();
});
