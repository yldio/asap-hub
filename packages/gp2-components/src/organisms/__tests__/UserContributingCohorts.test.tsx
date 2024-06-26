import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserContributingCohorts from '../UserContributingCohorts';

describe('UserContributingCohorts', () => {
  type ContributingCohort = gp2.UserResponse['contributingCohorts'][number];
  const getCohorts = (length = 1): ContributingCohort[] =>
    Array.from(
      { length },
      (_, itemIndex): ContributingCohort => ({
        contributingCohortId: `id-${itemIndex}`,
        name: `a name ${itemIndex}`,
        role: 'Investigator',
        studyUrl: `http://a-url-${itemIndex}`,
      }),
    );
  const renderUserCohorts = (
    contributingCohorts: ContributingCohort[],
    editHref?: string,
  ) =>
    render(
      <UserContributingCohorts
        contributingCohorts={contributingCohorts}
        editHref={editHref}
      />,
    );

  it('renders cohort name', () => {
    renderUserCohorts(getCohorts(1));
    expect(screen.getByText('a name 0')).toBeVisible();
  });
  it('renders multiple cohorts', () => {
    renderUserCohorts(getCohorts(2));
    expect(screen.getByText('a name 0')).toBeVisible();
    expect(screen.getByText('a name 1')).toBeVisible();
  });

  it.each(gp2.userContributingCohortRole)('renders the role - %s', (role) => {
    const cohort = { ...getCohorts(1)[0]!, role };
    render(<UserContributingCohorts contributingCohorts={[cohort]} />);
    expect(screen.getByText(role)).toBeVisible();
  });

  it('renders cohort study', () => {
    renderUserCohorts(getCohorts(1));
    const link = screen.getByRole('link', { name: /View study/i });
    expect(link).toBeVisible();
    expect(link).toHaveAttribute('href', 'http://a-url-0');
  });

  it('renders show more button for more than 3 cohorts', async () => {
    renderUserCohorts(getCohorts(4));
    expect(screen.getByRole('button', { name: /Show more/i })).toBeVisible();
  });

  it('renders show less button when the show more button is clicked', async () => {
    renderUserCohorts(getCohorts(4));

    const button = screen.getByRole('button', { name: /Show more/i });
    userEvent.click(button);
    expect(screen.getByRole('button', { name: /Show less/i })).toBeVisible();
  });
  it('does not show a more button for less than 3 cohorts', async () => {
    renderUserCohorts(getCohorts(3));

    expect(
      screen.queryByRole('button', { name: /Show more/i }),
    ).not.toBeInTheDocument();
  });
  it('displays the hidden cohorts if the show more button is clicked', () => {
    renderUserCohorts(getCohorts(4));

    expect(screen.getByText('a name 3')).not.toBeVisible();
    const button = screen.getByRole('button', { name: /Show more/i });
    userEvent.click(button);
    expect(screen.getByText('a name 3')).toBeVisible();
  });

  describe('if no contributing cohorts', () => {
    it('renders placeholder when theres an edit link', () => {
      renderUserCohorts([]);
      expect(
        screen.queryByText(/list out the contributing cohort studies/i),
      ).not.toBeInTheDocument();
      renderUserCohorts([], '/');
      expect(
        screen.getByText(/list out the contributing cohort studies/i),
      ).toBeVisible();
    });
  });
});
