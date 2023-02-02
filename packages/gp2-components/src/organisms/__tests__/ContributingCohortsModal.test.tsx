import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { MemoryRouter } from 'react-router-dom';
import ContributingCohortsModal from '../ContributingCohortsModal';

describe('ContributingCohortsModal', () => {
  // const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

  const getAddButton = () =>
    screen.getByRole('button', {
      name: /add another cohort/i,
    });
  const getRemoveButton = () =>
    screen.getByRole('button', {
      name: /delete/i,
    });
  beforeEach(jest.resetAllMocks);
  type ContributingCohortsModalProps = ComponentProps<
    typeof ContributingCohortsModal
  >;
  const defaultProps: ContributingCohortsModalProps = {
    ...gp2Fixtures.createUserResponse(),
    backHref: '',
    onSave: jest.fn(),
    cohortOptions: [],
  };

  const renderContributingCohorts = (
    overrides: Partial<ContributingCohortsModalProps> = {},
  ) =>
    render(<ContributingCohortsModal {...defaultProps} {...overrides} />, {
      wrapper: MemoryRouter,
    });

  it('renders a dialog with the right title', () => {
    renderContributingCohorts();
    expect(screen.getByRole('dialog')).toContainElement(
      screen.getByRole('heading', { name: 'Contributing Cohort Studies' }),
    );
  });
  it('renders name, role and study link', () => {
    renderContributingCohorts();
    expect(
      screen.getByRole('textbox', { name: /Name \(required\)/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: /Role \(required\)/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('textbox', { name: /link \(optional\)/i }),
    ).toBeVisible();
  });
  it('can add an extra cohort', () => {
    renderContributingCohorts();
    expect(
      screen.getByRole('heading', { name: /#1 Cohort Study/i }),
    ).toBeVisible();
    expect(
      screen.queryByRole('heading', { name: /#2 Cohort Study/i }),
    ).not.toBeInTheDocument();
    const addButton = getAddButton();
    userEvent.click(addButton);
    expect(
      screen.getByRole('heading', { name: /#2 Cohort Study/i }),
    ).toBeVisible();
  });
  it('there can be 9 cohorts', () => {
    const contributingCohorts = Array.from({ length: 9 }).map((_, i) => ({
      ...defaultProps.contributingCohorts[0],
      contributingCohortId: `${i}`,
    }));
    renderContributingCohorts({
      contributingCohorts,
    });
    expect(
      screen.queryByRole('button', {
        name: /add another cohort/i,
      }),
    ).toBeVisible();
  });
  it('there can be only 10 cohorts', () => {
    const contributingCohorts = Array.from({ length: 10 }).map((_, i) => ({
      ...defaultProps.contributingCohorts[0],
      contributingCohortId: `${i}`,
    }));
    renderContributingCohorts({
      contributingCohorts,
    });
    expect(
      screen.queryByRole('button', {
        name: /add another cohort/i,
      }),
    ).not.toBeInTheDocument();
  });
  it('can remove an cohort', () => {
    const contributingCohorts = Array.from({ length: 2 }).map((_, i) => ({
      ...defaultProps.contributingCohorts[0],
      contributingCohortId: `${i}`,
    }));
    renderContributingCohorts({ contributingCohorts });
    expect(
      screen.getByRole('heading', { name: /#1 Cohort Study/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /#2 Cohort Study/i }),
    ).toBeVisible();
    const removeButton = getRemoveButton();
    userEvent.click(removeButton);
    expect(
      screen.queryByRole('heading', { name: /#2 Cohort Study/i }),
    ).not.toBeInTheDocument();
  });
  it.todo('how to remove all cohorts? first cohort has no delete');
  it.todo('can save cohorts with url');
  it.todo('can save cohorts without url');
  it.todo('validation url');
  it.todo('correct role');
  it.todo('name should be from list');
});
