import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import WorkingGroupCard from '../WorkingGroupCard';

const props: ComponentProps<typeof WorkingGroupCard> = {
  id: '42',
  title: 'My Working Group',
  externalLink: 'https://www.google.com',
  externalLinkText: 'Working Group Folder',
  description: 'My Working Group Description',
  lastModifiedDate: '2020-01-1',
};

it('renders the working group card', () => {
  const { getByText } = render(
    <WorkingGroupCard
      {...props}
      id="42"
      title="My Working Group"
      description="test description"
      externalLinkText="Link text"
      lastModifiedDate="2020-01-01"
    />,
  );
  expect(getByText('My Working Group')).toBeVisible();
  expect(getByText('test description')).toBeVisible();
  expect(getByText('Link text')).toBeVisible();
  expect(getByText('2020-01-01')).toBeVisible();
});

it('renders the working group name linking to the working group', () => {
  const { getByText } = render(
    <WorkingGroupCard {...props} id="42" title="My Group" />,
  );
  expect(getByText('My Group').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});

it('renders the working group description linking to the working group', () => {
  const { getByText } = render(
    <WorkingGroupCard {...props} id="42" description="test description" />,
  );
  expect(getByText('test description').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});
