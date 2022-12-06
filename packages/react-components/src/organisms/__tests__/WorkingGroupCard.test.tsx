import { ComponentProps } from 'react';
import { render } from '@testing-library/react';

import WorkingGroupCard from '../WorkingGroupCard';
import { formatDate } from '../../date';

const props: ComponentProps<typeof WorkingGroupCard> = {
  id: '42',
  title: 'My Working Group',
  externalLink: 'https://www.google.com',
  shortText: 'My Working Group Description',
  lastModifiedDate: '2020-01-1',
};

it('renders the working group card', () => {
  const { getByText } = render(
    <WorkingGroupCard
      {...props}
      id="42"
      title="My Working Group"
      shortText="test description"
      lastModifiedDate="2020-01-01"
    />,
  );
  expect(getByText('My Working Group')).toBeVisible();
  expect(getByText('test description')).toBeVisible();
  expect(getByText('Working Group Folder')).toBeVisible();
  expect(
    getByText(`Last updated: ${formatDate(new Date('2020-01-01'))}`),
  ).toBeVisible();
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

it('renders the working group shortText linking to the working group', () => {
  const { getByText } = render(
    <WorkingGroupCard {...props} id="42" shortText="test description" />,
  );
  expect(getByText('test description').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/42$/),
  );
});
