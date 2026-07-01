import { UserAwardWithTeam } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserProfileBadges, { badgesAnchorId } from '../UserProfileBadges';

const makeBadge = (i: number): UserAwardWithTeam => ({
  name: 'Open Science Champion',
  date: `2024-0${i}-01`,
  iconUrl: `https://example.com/badge-${i}.png`,
  teamName: `Team ${i}`,
});

it('renders nothing when there are no badges', () => {
  const { container } = render(<UserProfileBadges badges={[]} />);
  expect(container).toBeEmptyDOMElement();
});

it('shows each badge icon and awarding team name', () => {
  render(<UserProfileBadges badges={[makeBadge(1), makeBadge(2)]} />);

  expect(screen.getAllByAltText('Open Science Champion')).toHaveLength(2);
  expect(screen.getByText('Team 1')).toBeVisible();
  expect(screen.getByText('Team 2')).toBeVisible();
});

it('exposes the badges anchor for the profile-photo badge link', () => {
  const { container } = render(<UserProfileBadges badges={[makeBadge(1)]} />);
  expect(container.querySelector(`#${badgesAnchorId}`)).toBeInTheDocument();
});

it('shows at most 4 badges until View more is clicked', async () => {
  const badges = [1, 2, 3, 4, 5, 6].map(makeBadge);
  render(<UserProfileBadges badges={badges} />);

  expect(screen.getAllByRole('listitem')).toHaveLength(4);

  await userEvent.click(screen.getByText(/view more/i));
  expect(screen.getAllByRole('listitem')).toHaveLength(6);

  await userEvent.click(screen.getByText(/view less/i));
  expect(screen.getAllByRole('listitem')).toHaveLength(4);
});

it('does not show View more with 4 or fewer badges', () => {
  render(<UserProfileBadges badges={[1, 2, 3, 4].map(makeBadge)} />);
  expect(screen.queryByText(/view more/i)).not.toBeInTheDocument();
});
