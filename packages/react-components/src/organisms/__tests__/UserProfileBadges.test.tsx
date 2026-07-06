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

// jsdom does no layout (every element reports offsetTop 0), so simulate row
// wrapping: assign each list item an offsetTop based on its index and the given
// per-row count, matching how the component counts the first row.
const mockRowWrap = (perRow: number) =>
  jest
    .spyOn(HTMLElement.prototype, 'offsetTop', 'get')
    .mockImplementation(function offsetTop(this: HTMLElement) {
      const parent = this.parentElement;
      if (!parent || this.tagName !== 'LI') {
        return 0;
      }
      const index = Array.from(parent.children).indexOf(this);
      return Math.floor(index / perRow) * 100;
    });

afterEach(() => {
  jest.restoreAllMocks();
});

it('renders nothing when there are no badges', () => {
  const { container } = render(<UserProfileBadges badges={[]} />);
  expect(container).toBeEmptyDOMElement();
});

it('shows each badge icon and awarding team name', () => {
  mockRowWrap(5); // both fit the first row
  render(<UserProfileBadges badges={[makeBadge(1), makeBadge(2)]} />);

  expect(screen.getAllByAltText('Open Science Champion')).toHaveLength(2);
  expect(screen.getByText('Team 1')).toBeVisible();
  expect(screen.getByText('Team 2')).toBeVisible();
});

it('exposes the badges anchor for the profile-photo badge link', () => {
  const { container } = render(<UserProfileBadges badges={[makeBadge(1)]} />);
  expect(container.querySelector(`#${badgesAnchorId}`)).toBeInTheDocument();
});

it('collapses to the first row, then shows all on View More Badges', async () => {
  const badges = [1, 2, 3, 4, 5, 6].map(makeBadge);
  mockRowWrap(5); // 5 fit a row -> collapsed shows 5
  render(<UserProfileBadges badges={badges} />);

  expect(screen.getAllByRole('listitem')).toHaveLength(5);

  await userEvent.click(screen.getByText(/view more badges/i));
  expect(screen.getAllByRole('listitem')).toHaveLength(6);

  await userEvent.click(screen.getByText(/view less badges/i));
  expect(screen.getAllByRole('listitem')).toHaveLength(5);
});

it('shows at least 4 badges across full rows on narrow screens', () => {
  const badges = [1, 2, 3, 4, 5, 6].map(makeBadge);
  mockRowWrap(2); // 2 per row -> two full rows of 2 = 4
  render(<UserProfileBadges badges={badges} />);

  expect(screen.getAllByRole('listitem')).toHaveLength(4);
  expect(screen.getByText(/view more badges/i)).toBeInTheDocument();
});

it('fills whole rows so the collapsed view has no orphan badge', () => {
  const badges = [1, 2, 3, 4, 5, 6, 7].map(makeBadge);
  mockRowWrap(3); // 3 per row -> rounds the 4 minimum up to two full rows = 6
  render(<UserProfileBadges badges={badges} />);

  expect(screen.getAllByRole('listitem')).toHaveLength(6);
  expect(screen.getByText(/view more badges/i)).toBeInTheDocument();
});

it('does not show View More Badges when every badge fits the collapsed view', () => {
  mockRowWrap(5); // 5 fit a row, only 4 badges
  render(<UserProfileBadges badges={[1, 2, 3, 4].map(makeBadge)} />);

  expect(screen.getAllByRole('listitem')).toHaveLength(4);
  expect(screen.queryByText(/view more badges/i)).not.toBeInTheDocument();
});
