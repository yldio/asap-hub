import { gp2 as gp2Fixtures } from '@asap-hub/fixtures';
import { gp2 as gp2Model } from '@asap-hub/model';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';
import { StaticRouter } from 'react-router-dom';
import ContributingCohortsModal from '../ContributingCohortsModal';

describe('ContributingCohortsModal', () => {
  type ContributingCohortsModalProps = ComponentProps<
    typeof ContributingCohortsModal
  >;

  const getSaveButton = () => screen.getByRole('button', { name: 'Save' });

  const getAddButton = () =>
    screen.getByRole('button', {
      name: /add another study/i,
    });

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
      wrapper: StaticRouter,
    });

  beforeEach(jest.resetAllMocks);

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
      ...defaultProps.contributingCohorts[0]!,
      contributingCohortId: `${i}`,
    }));
    renderContributingCohorts({
      contributingCohorts,
    });
    expect(
      screen.queryByRole('button', {
        name: /add another study/i,
      }),
    ).toBeVisible();
  });

  it('there can be only 10 cohorts', () => {
    const contributingCohorts = Array.from({ length: 10 }).map((_, i) => ({
      ...defaultProps.contributingCohorts[0]!,
      contributingCohortId: `${i}`,
    }));
    renderContributingCohorts({
      contributingCohorts,
    });
    expect(
      screen.queryByRole('button', {
        name: /add another study/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('can remove an cohort', () => {
    const contributingCohorts = Array.from({ length: 2 }).map((_, i) => ({
      ...defaultProps.contributingCohorts[0]!,
      contributingCohortId: `${i}`,
    }));
    renderContributingCohorts({ contributingCohorts });
    expect(
      screen.getByRole('heading', { name: /#1 Cohort Study/i }),
    ).toBeVisible();
    expect(
      screen.getByRole('heading', { name: /#2 Cohort Study/i }),
    ).toBeVisible();

    const removeButton = within(
      screen.getByRole('heading', {
        name: /#2 Cohort Study/i,
      }).parentElement as HTMLElement,
    ).getByRole('button', {
      name: /delete/i,
    });

    userEvent.click(removeButton);
    expect(
      screen.queryByRole('heading', { name: /#2 Cohort Study/i }),
    ).not.toBeInTheDocument();
  });

  it('removing the last', () => {
    const contributingCohorts = [
      {
        ...defaultProps.contributingCohorts[0]!,
      },
    ];
    const onSave = jest.fn();
    renderContributingCohorts({ contributingCohorts, onSave });
    expect(
      screen.getByRole('heading', { name: /#1 Cohort Study/i }),
    ).toBeVisible();

    const removeButton = screen.getByRole('button', {
      name: /delete/i,
    });

    userEvent.click(removeButton);

    expect(
      screen.queryByRole('heading', { name: /#1 Cohort Study/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('button', {
        name: /add another study/i,
      }),
    ).not.toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: /add cohort study/i,
      }),
    ).toBeVisible();
  });

  it('allows the name to be edited', () => {
    const contributingCohortId = '11';
    const role = 'Investigator';
    const onSave = jest.fn();
    renderContributingCohorts({
      cohortOptions: [
        { id: '7', name: 'S3' },
        { id: '11', name: 'DIGPD' },
      ],
      contributingCohorts: [
        {
          contributingCohortId,
          name: 'DIGPD',
          role,
        },
      ],
      onSave,
    });
    const name = 'S3';
    const input = screen.getByRole('textbox', { name: /Name/i });
    userEvent.click(input);
    userEvent.click(screen.getByText(name));
    waitFor(() => expect(input).toHaveTextContent(name));
    userEvent.click(getSaveButton());
    expect(onSave).toBeCalledWith({
      contributingCohorts: [{ contributingCohortId: '7', role }],
    });
  });

  it.each(gp2Model.userContributingCohortRole)(
    'allows the role to be edited %s',
    (updatedRole) => {
      const contributingCohortId = '11';
      const role: gp2Model.UserContributingCohortRole =
        updatedRole === 'Investigator' ? 'Lead Investigator' : 'Investigator';

      const onSave = jest.fn();
      renderContributingCohorts({
        cohortOptions: [
          { id: '7', name: 'S3' },
          { id: '11', name: 'DIGPD' },
        ],
        contributingCohorts: [
          {
            contributingCohortId,
            name: 'DIGPD',
            role,
          },
        ],
        onSave,
      });
      const input = screen.getByRole('textbox', { name: /Role/i });
      userEvent.click(input);
      userEvent.click(screen.getByText(updatedRole));
      waitFor(() => expect(input).toHaveTextContent(updatedRole));
      userEvent.click(getSaveButton());
      expect(onSave).toBeCalledWith({
        contributingCohorts: [{ contributingCohortId, role: updatedRole }],
      });
    },
  );

  it('allows the link to be edited', () => {
    const contributingCohortId = '11';
    const role = 'Investigator';
    const onSave = jest.fn();
    renderContributingCohorts({
      cohortOptions: [
        { id: '7', name: 'S3' },
        { id: '11', name: 'DIGPD' },
      ],
      contributingCohorts: [
        {
          contributingCohortId,
          name: 'DIGPD',
          role,
        },
      ],
      onSave,
    });
    const studyUrl = 'http://example.com';
    const input = screen.getByRole('textbox', { name: /Link/i });
    userEvent.type(input, studyUrl);
    waitFor(() => expect(input).toHaveTextContent(studyUrl));
    userEvent.click(getSaveButton());
    expect(onSave).toBeCalledWith({
      contributingCohorts: [{ contributingCohortId, role, studyUrl }],
    });
  });

  it('shows the validation messages for required fields', () => {
    const onSave = jest.fn();
    renderContributingCohorts({
      cohortOptions: [
        { id: '7', name: 'S3' },
        { id: '11', name: 'DIGPD' },
      ],
      contributingCohorts: [],
      onSave,
    });
    userEvent.click(getSaveButton());
    expect(onSave).not.toBeCalled();
    expect(screen.getByText('Please add the cohort name')).toBeVisible();
    expect(screen.getByText('Please add the role')).toBeVisible();
  });

  it('does not allow an invalid url', () => {
    const contributingCohortId = '11';
    const role = 'Investigator';
    const onSave = jest.fn();
    renderContributingCohorts({
      cohortOptions: [
        { id: '7', name: 'S3' },
        { id: '11', name: 'DIGPD' },
      ],
      contributingCohorts: [
        {
          contributingCohortId,
          name: 'DIGPD',
          role,
        },
      ],
      onSave,
    });
    const studyUrl = 'http://invalid-url';
    const input = screen.getByRole('textbox', { name: /Link/i });
    userEvent.type(input, studyUrl);
    waitFor(() => expect(input).toHaveTextContent(studyUrl));
    userEvent.click(getSaveButton());
    expect(onSave).not.toBeCalled();
    expect(
      screen.getByText(/Please enter a valid URL, starting with http/),
    ).toBeVisible();
  });
});
