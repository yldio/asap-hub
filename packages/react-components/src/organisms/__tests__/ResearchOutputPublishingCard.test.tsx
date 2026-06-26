import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { startOfTomorrow } from 'date-fns';
import { ComponentProps } from 'react';
import { mockActErrorsInConsole } from '../../test-utils';
import ResearchOutputPublishingCard, {
  getPublishDateValidationMessage,
} from '../ResearchOutputPublishingCard';

const props: ComponentProps<typeof ResearchOutputPublishingCard> = {
  asapFunded: 'Not Sure',
  usedInPublication: 'Not Sure',
  sharingStatus: 'Network Only',
};

it.each`
  field                  | group                       | prop
  ${'asapFunded'}        | ${/funded by ASAP/i}        | ${'onChangeAsapFunded'}
  ${'usedInPublication'} | ${/used in a publication/i} | ${'onChangeUsedInPublication'}
  ${'sharingStatus'}     | ${/sharing status/i}        | ${'onChangeSharingStatus'}
`('triggers an onchange event for group $field', async ({ group, prop }) => {
  const onChangeFn = jest.fn();
  render(
    <ResearchOutputPublishingCard {...{ ...props, [prop]: onChangeFn }} />,
  );

  const groupInput = within(
    screen.getByRole('group', { name: group }),
  ).getAllByRole('radio')[1];

  await userEvent.click(groupInput!);

  expect(onChangeFn).toHaveBeenCalled();
});

it('conditionally shows date published field', async () => {
  const { rerender } = render(
    <ResearchOutputPublishingCard {...props} sharingStatus={'Network Only'} />,
  );
  expect(screen.queryByLabelText(/date made public/i)).not.toBeInTheDocument();

  rerender(
    <ResearchOutputPublishingCard {...props} sharingStatus={'Public'} />,
  );
  expect(screen.queryByLabelText(/date made public/i)).toBeVisible();
});

it('triggers an on change for date published', async () => {
  const onChangeFn = jest.fn();

  render(
    <ResearchOutputPublishingCard
      {...props}
      sharingStatus={'Public'}
      onChangePublishDate={onChangeFn}
    />,
  );

  await userEvent.type(
    screen.getByLabelText(/date made public/i),
    '2020-12-02',
  );
  expect(onChangeFn).toHaveBeenCalledWith(new Date('2020-12-02'));
});

it('shows the custom error message for a date in the future', async () => {
  // Suppress act() warnings from TextField's internal async validation state updates
  const consoleMock = mockActErrorsInConsole();

  const { findByText } = render(
    <ResearchOutputPublishingCard
      {...props}
      sharingStatus={'Public'}
      publishDate={startOfTomorrow()}
    />,
  );
  const dateInput = screen.getByLabelText(/date made public/i);
  await userEvent.click(dateInput);
  await userEvent.tab();
  expect(
    await findByText(/publish date cannot be greater than today/i),
  ).toBeVisible();

  consoleMock.mockRestore();
});

describe('getPublishDateValidationMessage returns', () => {
  const e: ValidityState = {
    badInput: false,
    rangeOverflow: false,
    rangeUnderflow: false,
    stepMismatch: false,
    tooLong: false,
    tooShort: false,
    typeMismatch: false,
    valid: false,
    valueMissing: false,
    customError: false,
    patternMismatch: false,
  };

  it('a message when the date is in the future', () => {
    expect(
      getPublishDateValidationMessage({ ...e, rangeOverflow: true }),
    ).toEqual('Publish date cannot be greater than today');
  });

  it('a message when the date is invalid', () => {
    expect(getPublishDateValidationMessage({ ...e, badInput: true })).toEqual(
      'Date published should be complete or removed',
    );
  });

  it('a message when the date is missing', () => {
    expect(
      getPublishDateValidationMessage({ ...e, valueMissing: true }),
    ).toEqual('Please enter the date made public.');
  });
});

it('disables the date field when imported from a manuscript', () => {
  render(
    <ResearchOutputPublishingCard
      {...props}
      sharingStatus={'Public'}
      isImportedFromManuscript
    />,
  );
  expect(screen.getByLabelText(/date made public/i)).toBeDisabled();
});

it('keeps the date field enabled when not imported from a manuscript', () => {
  render(<ResearchOutputPublishingCard {...props} sharingStatus={'Public'} />);
  expect(screen.getByLabelText(/date made public/i)).toBeEnabled();
});
