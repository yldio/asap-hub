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

// jsdom does no layout, so drive the row-fit calc via the list's clientWidth.
// perRow = floor((width + rowGap) / (itemWidth + rowGap)); with itemWidth 85 and
// rowGap 40, width 500 => 4 per row, width 600 => 5 per row, width 2000 => wide.
const mockListClientWidth = (value: number) =>
  jest
    .spyOn(HTMLElement.prototype, 'clientWidth', 'get')
    .mockReturnValue(value);

afterEach(() => {
  jest.restoreAllMocks();
});

it('renders nothing when there are no badges', () => {
  const { container } = render(<UserProfileBadges badges={[]} />);
  expect(container).toBeEmptyDOMElement();
});

it('shows each badge icon and awarding team name', () => {
  mockListClientWidth(2000); // wide enough that both fit collapsed
  render(<UserProfileBadges badges={[makeBadge(1), makeBadge(2)]} />);

  expect(screen.getAllByAltText('Open Science Champion')).toHaveLength(2);
  expect(screen.getByText('Team 1')).toBeVisible();
  expect(screen.getByText('Team 2')).toBeVisible();
});

it('exposes the badges anchor for the profile-photo badge link', () => {
  const { container } = render(<UserProfileBadges badges={[makeBadge(1)]} />);
  expect(container.querySelector(`#${badgesAnchorId}`)).toBeInTheDocument();
});

it('collapses to the badges that fit one row, then shows all on Show more', async () => {
  const badges = [1, 2, 3, 4, 5, 6].map(makeBadge);
  mockListClientWidth(500); // 4 fit a row -> collapsed shows 4
  render(<UserProfileBadges badges={badges} />);

  expect(screen.getAllByRole('listitem')).toHaveLength(4);

  await userEvent.click(screen.getByText(/show more/i));
  expect(screen.getAllByRole('listitem')).toHaveLength(6);

  await userEvent.click(screen.getByText(/show less/i));
  expect(screen.getAllByRole('listitem')).toHaveLength(4);
});

it('does not show Show more when every badge fits one row', () => {
  mockListClientWidth(600); // 5 fit a row
  render(<UserProfileBadges badges={[1, 2, 3, 4].map(makeBadge)} />);

  expect(screen.getAllByRole('listitem')).toHaveLength(4);
  expect(screen.queryByText(/show more/i)).not.toBeInTheDocument();
});
