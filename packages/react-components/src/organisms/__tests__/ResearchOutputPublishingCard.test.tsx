import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { startOfTomorrow } from 'date-fns';
import { mockActErrorsInConsole } from '../../test-utils';
import ResearchOutputPublishingCard, {
  type ResearchOutputPublishingCardProps,
} from '../ResearchOutputPublishingCard';
import { renderWithResearchOutputForm } from '../test-utils/research-output-form';

const defaultProps: ResearchOutputPublishingCardProps = {
  disableDateMadePublic: false,
  disableNonPublicSharingStatus: false,
  disableUsedInPublication: false,
};
it.each`
  field                  | group                       | expected
  ${'asapFunded'}        | ${/funded by ASAP/i}        | ${'No'}
  ${'usedInPublication'} | ${/used in a publication/i} | ${'No'}
  ${'sharingStatus'}     | ${/sharing status/i}        | ${'Public'}
`('updates form value for group $field', async ({ field, group, expected }) => {
  const { methodsRef } = renderWithResearchOutputForm(
    <ResearchOutputPublishingCard {...defaultProps} />,
  );

  const groupInput = within(
    screen.getByRole('group', { name: group }),
  ).getAllByRole('radio')[1];

  await userEvent.click(groupInput!);

  expect(methodsRef.current?.getValues(field)).toEqual(expected);
});

it('conditionally shows date published field', async () => {
  renderWithResearchOutputForm(
    <ResearchOutputPublishingCard {...defaultProps} />,
    {
      defaultValues: { sharingStatus: 'Network Only' },
    },
  );
  expect(screen.queryByLabelText(/date made public/i)).not.toBeInTheDocument();

  await userEvent.click(
    within(screen.getByRole('group', { name: /sharing status/i })).getByRole(
      'radio',
      { name: /Public/i },
    ),
  );
  expect(screen.queryByLabelText(/date made public/i)).toBeVisible();
});

it('enables the date made public field when disableDateMadePublic is false', () => {
  renderWithResearchOutputForm(
    <ResearchOutputPublishingCard
      {...defaultProps}
      disableDateMadePublic={false}
    />,
    { defaultValues: { sharingStatus: 'Public' } },
  );
  expect(screen.getByLabelText(/date made public/i)).toBeEnabled();
});

it('disables the date made public field when disableDateMadePublic is true', () => {
  renderWithResearchOutputForm(
    <ResearchOutputPublishingCard
      {...defaultProps}
      disableDateMadePublic={true}
    />,
    { defaultValues: { sharingStatus: 'Public' } },
  );
  expect(screen.getByLabelText(/date made public/i)).toBeDisabled();
});

it('updates form value for date published', async () => {
  const { methodsRef } = renderWithResearchOutputForm(
    <ResearchOutputPublishingCard {...defaultProps} />,
    { defaultValues: { sharingStatus: 'Public' } },
  );

  await userEvent.type(
    screen.getByLabelText(/date made public/i),
    '2020-12-02',
  );
  expect(methodsRef.current?.getValues('publishDate')).toEqual(
    new Date('2020-12-02'),
  );
});

it('shows the custom error message for a date in the future', async () => {
  // Suppress act() warnings from TextField's internal async validation state updates
  const consoleMock = mockActErrorsInConsole();

  const { findByText } = renderWithResearchOutputForm(
    <ResearchOutputPublishingCard {...defaultProps} />,
    {
      defaultValues: {
        sharingStatus: 'Public',
        publishDate: startOfTomorrow(),
      },
    },
  );
  const dateInput = screen.getByLabelText(/date made public/i);
  await userEvent.click(dateInput);
  await userEvent.tab();
  expect(
    await findByText(/publish date cannot be greater than today/i),
  ).toBeVisible();

  consoleMock.mockRestore();
});

it('prompts for the date when editing a public output that has no date', async () => {
  // Suppress act() warnings from DateField's internal async validation state updates
  const consoleMock = mockActErrorsInConsole();

  const { findByText } = renderWithResearchOutputForm(
    <ResearchOutputPublishingCard {...defaultProps} />,
    { defaultValues: { sharingStatus: 'Public' } },
  );

  const dateInput = screen.getByLabelText(/date made public/i);
  expect(dateInput).toBeEnabled();
  expect(dateInput).toHaveValue('');

  await userEvent.click(dateInput);
  await userEvent.tab();

  expect(await findByText(/please enter the date made public/i)).toBeVisible();

  consoleMock.mockRestore();
});

it('stops asking for the date once the sharing status is not public', async () => {
  const { methodsRef, queryByText } = renderWithResearchOutputForm(
    <ResearchOutputPublishingCard {...defaultProps} />,
    { defaultValues: { sharingStatus: 'Public' } },
  );

  await userEvent.click(screen.getByLabelText(/date made public/i));
  await userEvent.tab();

  await userEvent.click(
    within(screen.getByRole('group', { name: /sharing status/i })).getByRole(
      'radio',
      { name: /CRN Only/i },
    ),
  );

  expect(await methodsRef.current?.trigger()).toBe(true);
  expect(queryByText(/please enter the date made public/i)).toBeNull();
});
