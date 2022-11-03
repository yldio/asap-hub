import { ComponentProps } from 'react';
import { createListTeamResponse } from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import TeamsTabbedCard from '../TeamsTabbedCard';

const props: ComponentProps<typeof TeamsTabbedCard> = {
  teams: [],
  title: '',
  disableActiveTab: false,
};

describe('renders the teams tabbed card', () => {
  const renderTabbedCard = (disableActiveTab: boolean) =>
    render(
      <TeamsTabbedCard
        {...props}
        teams={[
          { displayName: 'team 1', id: '123' },
          { displayName: 'team 2', id: '123', inactiveSince: '2021-01-01' },
        ]}
        title="Example"
        disableActiveTab={disableActiveTab}
      />,
    );

  it('renders for an Active Group', () => {
    renderTabbedCard(false);
    expect(screen.getByRole('heading').textContent).toEqual('Example');
    expect(screen.getByText('Past Teams (1)')).toBeVisible();
    expect(screen.getByText('Active Teams (1)')).toBeVisible();
    expect(screen.getByText(/team 1/)).toBeVisible();

    fireEvent.click(screen.getByText('Past Teams (1)'));
    expect(screen.getByText(/team 2/)).toBeVisible();
  });

  it('renders for an Inactive Group', () => {
    renderTabbedCard(true);
    expect(screen.getByText('Past Teams (2)')).toBeVisible();
    expect(screen.getByText('Active Teams (0)')).toBeVisible();
    expect(screen.getByText(/team 1/)).toBeVisible();
    expect(screen.getByText(/team 2/)).toBeVisible();
  });
});

it('shows the correct more and less button text', () => {
  render(
    <TeamsTabbedCard
      {...props}
      teams={createListTeamResponse(20).items}
      title="Example"
    />,
  );
  fireEvent.click(screen.getByText('View More Teams'));
  expect(screen.getByText(/View Less Teams/)).toBeVisible();
});
