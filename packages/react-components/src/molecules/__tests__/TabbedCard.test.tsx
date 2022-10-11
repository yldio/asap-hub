import { createGroupResponse } from '@asap-hub/fixtures';
import { GroupDataObject } from '@asap-hub/model';
import { fireEvent, render } from '@testing-library/react';
import TabbedCard from '../TabbedCard';

const groups = [
  { ...createGroupResponse(), name: 'Group 1', id: 'g1' },
  { ...createGroupResponse(), name: 'Group 2', id: 'g2' },
  { ...createGroupResponse(), name: 'Group 3', id: 'g3' },
];

const firstTab = {
  tabTitle: `First Tab`,
  items: groups,
  createItem: (group: GroupDataObject) => (
    <li key={`group-${group.id}`}>{group.name}</li>
  ),
  truncateFrom: 2,
};

const secondTab = {
  ...firstTab,
  tabTitle: `Second Tab`,
  items: [
    {
      ...createGroupResponse(),
      name: 'Second tab group',
      id: '3',
    },
  ],
};

it('renders the tabbed card correctly and can switch to the second tab', () => {
  const { getByText } = render(
    <TabbedCard
      title="test card"
      description="description"
      tabs={[firstTab, secondTab]}
    />,
  );
  expect(getByText('test card')).toBeVisible();
  expect(getByText('description')).toBeVisible();
  expect(getByText('First Tab')).toBeVisible();
  expect(getByText('Second Tab')).toBeVisible();
  expect(getByText('View more interest groups')).toBeVisible();
});

it('can switch to the second tab', () => {
  const { getByText, queryByText } = render(
    <TabbedCard
      title="test card"
      description="description"
      tabs={[firstTab, secondTab]}
    />,
  );

  expect(getByText('Group 1')).toBeVisible();
  expect(getByText('Group 2')).toBeVisible();
  expect(queryByText('Second tab group')).not.toBeInTheDocument();

  fireEvent.click(getByText('Second Tab'));
  expect(queryByText('Group 1')).not.toBeInTheDocument();
  expect(queryByText('Group 2')).not.toBeInTheDocument();
  expect(getByText('Second tab group')).toBeVisible();
});

it('cannot switch to a disabled tab', () => {
  const { getByText, queryByText } = render(
    <TabbedCard
      title="test card"
      description="description"
      tabs={[firstTab, { ...secondTab, disabled: true }]}
    />,
  );

  expect(getByText('Group 1')).toBeVisible();
  expect(getByText('Group 2')).toBeVisible();
  expect(queryByText('Second tab group')).not.toBeInTheDocument();

  fireEvent.click(getByText('Second Tab'));
  expect(getByText('Group 1')).toBeVisible();
  expect(getByText('Group 2')).toBeVisible();
  expect(queryByText('Second tab group')).not.toBeInTheDocument();
});

it('automatically displays the active tab', () => {
  const { getByText, queryByText } = render(
    <TabbedCard
      title="test card"
      description="description"
      tabs={[firstTab, secondTab]}
      activeTabIndex={1}
    />,
  );

  expect(queryByText('Group 1')).not.toBeInTheDocument();
  expect(queryByText('Group 2')).not.toBeInTheDocument();
  expect(getByText('Second tab group')).toBeVisible();
});

it('can click the show more button and display the data', () => {
  const { getByText, queryByText } = render(
    <TabbedCard
      title="test card"
      description="description"
      tabs={[firstTab, secondTab]}
    />,
  );

  expect(getByText('Group 1')).toBeVisible();
  expect(getByText('Group 2')).toBeVisible();
  expect(queryByText('Group 3')).not.toBeInTheDocument();
  fireEvent.click(getByText('View more interest groups'));
  expect(getByText('Group 3')).toBeVisible();
  fireEvent.click(getByText('View less interest groups'));
  expect(queryByText('Group 3')).not.toBeInTheDocument();
});

it('resets view more on tab change', () => {
  const { getByText, queryByText } = render(
    <TabbedCard
      title="test card"
      description="description"
      tabs={[firstTab, { ...firstTab, tabTitle: 'Second Tab' }]}
    />,
  );

  expect(queryByText('View less interest groups')).not.toBeInTheDocument();
  fireEvent.click(getByText('View more interest groups'));
  expect(getByText('View less interest groups')).toBeVisible();
  fireEvent.click(getByText('Second Tab'));
  expect(getByText('View more interest groups')).toBeVisible();
  expect(queryByText('View less interest groups')).not.toBeInTheDocument();
});
