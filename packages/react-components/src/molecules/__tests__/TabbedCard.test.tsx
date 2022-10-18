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
    <div key={`group-${group.id}`}>{group.name}</div>
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

const props = {
  title: `Tabbed Card`,
  description: `Description`,
  tabs: [firstTab, secondTab],
};

describe('rendering and tabbing', () => {
  it('renders the tabbed card', () => {
    const { getByText, getByRole } = render(
      <TabbedCard {...props} title="test card" description="description" />,
    );

    expect(getByRole('heading', { name: 'test card' })).toBeVisible();
    expect(getByText('description')).toBeVisible();
  });

  it('can switch to the second tab', () => {
    const { getByText, queryByText } = render(<TabbedCard {...props} />);

    expect(getByText('Group 1')).toBeVisible();
    expect(getByText('Group 2')).toBeVisible();
    expect(queryByText('Second tab group')).not.toBeInTheDocument();

    fireEvent.click(getByText('Second Tab'));
    expect(queryByText('Group 1')).not.toBeInTheDocument();
    expect(queryByText('Group 2')).not.toBeInTheDocument();
    expect(getByText('Second tab group')).toBeVisible();
  });

  it('cannot switch to a disabled tab', () => {
    const { getByText, getByRole } = render(
      <TabbedCard
        {...props}
        tabs={[
          { ...firstTab, tabTitle: 'First Tab' },
          { ...secondTab, disabled: true, tabTitle: 'Second Tab' },
        ]}
      />,
    );
    expect(getByRole('button', { name: 'First Tab' })).toHaveStyleRule(
      'font-weight',
      'bold',
    );

    expect(getByRole('button', { name: 'First Tab' })).toBeEnabled();
    expect(getByRole('button', { name: 'Second Tab' })).toBeDisabled();
    fireEvent.click(getByText('Second Tab'));
    expect(getByRole('button', { name: 'Second Tab' })).toBeDisabled();
  });

  it('shows the selected tab', () => {
    const { getByText } = render(
      <TabbedCard
        {...props}
        activeTabIndex={1}
        tabs={[
          firstTab,
          {
            ...firstTab,
            tabTitle: 'Target',
            items: [
              {
                ...createGroupResponse(),
                name: 'Second Tab Group',
                id: 'g1',
              },
            ],
          },
        ]}
      />,
    );

    expect(getByText('Target')).not.toHaveStyleRule('font-weight', 'bold');
    expect(getByText('Second Tab Group')).toBeVisible();
  });

  it('displays tabs as active by default', () => {
    const { getByRole } = render(<TabbedCard {...props} />);
    expect(getByRole('button', { name: 'First Tab' })).toBeEnabled();
    expect(getByRole('button', { name: 'Second Tab' })).toBeEnabled();
  });
});

describe('the view more functionality', () => {
  it('display the data once the button is clicked', () => {
    const { getByText, queryByText } = render(<TabbedCard {...props} />);

    expect(getByText('First Tab')).toBeVisible();
    expect(getByText('Second Tab')).toBeVisible();
    expect(getByText('View more interest groups')).toBeVisible();

    expect(getByText('Group 1')).toBeVisible();
    expect(getByText('Group 2')).toBeVisible();
    expect(queryByText('Group 3')).not.toBeInTheDocument();
    fireEvent.click(getByText('View more interest groups'));
    expect(getByText('Group 3')).toBeVisible();
    fireEvent.click(getByText('View less interest groups'));
    expect(queryByText('Group 3')).not.toBeInTheDocument();
  });

  it('resets on tab change', () => {
    const { getByText, queryByText } = render(
      <TabbedCard
        {...props}
        tabs={[firstTab, { ...firstTab, tabTitle: 'Second Tab' }]}
      />,
    );

    fireEvent.click(getByText('View more interest groups'));
    expect(getByText('View less interest groups')).toBeVisible();

    fireEvent.click(getByText('Second Tab'));
    expect(getByText('View more interest groups')).toBeVisible();
    expect(queryByText('View less interest groups')).not.toBeInTheDocument();
  });

  it('displays the right number both trimmed and expanded', () => {
    const { getByText, queryByText, getAllByText } = render(
      <TabbedCard
        {...props}
        tabs={[
          {
            ...firstTab,
            truncateFrom: 2,
            items: [
              { ...createGroupResponse(), name: 'Group 1', id: 'g1' },
              { ...createGroupResponse(), name: 'Group 2', id: 'g2' },
              { ...createGroupResponse(), name: 'Group 3', id: 'g3' },
            ],
          },
          secondTab,
        ]}
      />,
    );

    expect(
      getAllByText(/Group/i, { selector: 'div' }).map(
        ({ textContent }) => textContent,
      ),
    ).toEqual(['Group 1', 'Group 2']);
    expect(queryByText('Group 3')).not.toBeInTheDocument();

    fireEvent.click(getByText('View more interest groups'));
    expect(
      getAllByText(/Group/i, { selector: 'div' }).map(
        ({ textContent }) => textContent,
      ),
    ).toEqual(['Group 1', 'Group 2', 'Group 3']);
  });
});
