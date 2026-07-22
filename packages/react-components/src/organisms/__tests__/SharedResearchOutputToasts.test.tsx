import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SharedResearchOutputToasts, {
  SharedResearchOutputToastsProps,
} from '../SharedResearchOutputToasts';

const defaultProps: SharedResearchOutputToastsProps = {
  association: 'working group',
  documentType: 'Article',
  published: false,
  statusChangedBy: undefined,
  toast: undefined,
  reviewToggled: false,
  associationName: 'Association Name',
  isInReview: false,
};

it('should render draft created toast', async () => {
  const { queryByText, getByText, getByRole } = render(
    <SharedResearchOutputToasts {...defaultProps} toast="draftCreated" />,
  );

  const toastText = 'Draft Working Group Article created successfully.';

  expect(getByText(toastText)).toBeInTheDocument();

  const closeButton = getByRole('button');

  await userEvent.click(closeButton);

  await waitFor(() => expect(queryByText(toastText)).toBeNull());
});

test.each`
  associationDisplayableText | association
  ${'Working Group'}         | ${'working group'}
  ${'Team'}                  | ${'team'}
`(
  'should render draft created toast for $associationDisplayableText',
  async ({ associationDisplayableText, association }) => {
    const { queryByText, getByText, getByRole } = render(
      <SharedResearchOutputToasts
        {...defaultProps}
        toast="draftCreated"
        association={association}
      />,
    );

    const toastText = `Draft ${associationDisplayableText} Article created successfully.`;

    expect(getByText(toastText)).toBeInTheDocument();

    const closeButton = getByRole('button');

    await userEvent.click(closeButton);

    await waitFor(() => expect(queryByText(toastText)).toBeNull());
  },
);

it('should render review requested toast', async () => {
  const { queryByText, getByText, getByRole } = render(
    <SharedResearchOutputToasts
      {...defaultProps}
      reviewToggled={true}
      statusChangedBy={{
        id: 'user-id',
        firstName: 'First',
        lastName: 'Last',
      }}
      isInReview={true}
    />,
  );

  const toastText =
    'Draft working group Article submitted for PM review successfully.';

  expect(getByText(toastText)).toBeInTheDocument();

  const closeButton = getByRole('button');

  await userEvent.click(closeButton);

  await waitFor(() => expect(queryByText(toastText)).toBeNull());
});

it('should render review dismissed toast', async () => {
  const { queryByText, getByText, getByRole } = render(
    <SharedResearchOutputToasts
      {...defaultProps}
      reviewToggled={true}
      statusChangedBy={undefined}
    />,
  );

  const toastText =
    'In review working group Article switched to draft successfully.';

  expect(getByText(toastText)).toBeInTheDocument();

  const closeButton = getByRole('button');

  await userEvent.click(closeButton);

  await waitFor(() => expect(queryByText(toastText)).toBeNull());
});

it('should render review requested toast with association name', async () => {
  const { getByText } = render(
    <SharedResearchOutputToasts
      {...defaultProps}
      statusChangedBy={{
        id: 'user-id',
        firstName: 'First',
        lastName: 'Last',
      }}
      isInReview={true}
    />,
  );

  expect(
    getByText(
      'First Last on Association Name requested PMs to review this output. This draft is only available to members in the working group listed below.',
    ),
  ).toBeInTheDocument();
});

it('should render published now toast', async () => {
  const { queryByText, getByText, getByRole } = render(
    <SharedResearchOutputToasts
      {...defaultProps}
      published
      toast="published"
    />,
  );

  const toastText = 'Working Group Article published successfully.';

  expect(getByText(toastText)).toBeInTheDocument();

  const closeButton = getByRole('button');

  await userEvent.click(closeButton);

  await waitFor(() => expect(queryByText(toastText)).toBeNull());
});

it('should render only PMs can publish output', async () => {
  const { getByText } = render(
    <SharedResearchOutputToasts
      {...defaultProps}
      statusChangedBy={undefined}
    />,
  );

  expect(
    getByText(
      'This draft is available to members in the working group listed below. Only PMs can publish this output.',
    ),
  ).toBeInTheDocument();
});
