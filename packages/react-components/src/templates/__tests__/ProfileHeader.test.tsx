import React, { ComponentProps } from 'react';
import { render } from '@testing-library/react';
import { subYears, formatISO } from 'date-fns';
import ProfileHeader from '../ProfileHeader';

const boilerplateProps: ComponentProps<typeof ProfileHeader> = {
  displayName: 'John Doe',
  teams: [],
  lastModifiedDate: formatISO(new Date()),
  aboutHref: './about',
  researchHref: './research',
  outputsHref: './outputs',
};

it('renders the name as the top-level heading', () => {
  const { getByRole } = render(
    <ProfileHeader {...boilerplateProps} displayName="John Doe" />,
  );
  expect(getByRole('heading')).toHaveTextContent('John Doe');
  expect(getByRole('heading').tagName).toBe('H1');
});

it('generates the last updated text', () => {
  const { container } = render(
    <ProfileHeader
      {...boilerplateProps}
      lastModifiedDate={formatISO(subYears(new Date(), 2))}
    />,
  );
  expect(container).toHaveTextContent(/update.* 2 years ago/);
});
