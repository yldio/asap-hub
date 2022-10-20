import { ComponentProps } from 'react';
import { createListTeamResponse } from '@asap-hub/fixtures';
import { fireEvent, render, screen } from '@testing-library/react';
import TeamsTabbedCard from '../TeamsTabbedCard';

const props: ComponentProps<typeof TeamsTabbedCard> = {
  teams: [],
  title: '',
};
it('renders the teams tabbed card', () => {
  render(
    <TeamsTabbedCard
      {...props}
      teams={[{ displayName: 'team 1', id: '123' }]}
      title="Example"
    />,
  );
  expect(screen.getByRole('heading').textContent).toEqual('Example');
  expect(screen.getByTitle('Team')).toBeInTheDocument();
  expect(screen.getByText(/team 1/)).toBeVisible();
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
