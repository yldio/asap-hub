import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import SharedResearchOutputBanners, {
  SharedResearchOutputBannersProps,
} from '../SharedResearchOutputBanners';

const defaultProps: SharedResearchOutputBannersProps = {
  association: 'working group',
  documentType: 'Article',
  published: false,
  statusChangedBy: undefined,
  publishedNow: false,
  draftCreated: false,
  reviewToggled: false,
  associationName: 'Association Name',
  isInReview: false,
};

it('should render draft created banner', async () => {
  const { queryByText, getByText, getByRole } = render(
    <SharedResearchOutputBanners {...defaultProps} draftCreated={true} />,
  );

  const bannerText = 'Draft Working Group Article created successfully.';

  expect(getByText(bannerText)).toBeInTheDocument();

  const closeButton = getByRole('button');

  userEvent.click(closeButton);

  await waitFor(() => expect(queryByText(bannerText)).toBeNull());
});

test.each`
  associationDisplayableText | association
  ${'Working Group'}         | ${'working group'}
  ${'Team'}                  | ${'team'}
`(
  'should render draft created banner for $associationDisplayableText',
  async ({ associationDisplayableText, association }) => {
    const { queryByText, getByText, getByRole } = render(
      <SharedResearchOutputBanners
        {...defaultProps}
        draftCreated={true}
        association={association}
      />,
    );

    const bannerText = `Draft ${associationDisplayableText} Article created successfully.`;

    expect(getByText(bannerText)).toBeInTheDocument();

    const closeButton = getByRole('button');

    userEvent.click(closeButton);

    await waitFor(() => expect(queryByText(bannerText)).toBeNull());
  },
);

it('should render review requested banner', async () => {
  const { queryByText, getByText, getByRole } = render(
    <SharedResearchOutputBanners
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

  const bannerText =
    'Draft working group Article submitted for PM review successfully.';

  expect(getByText(bannerText)).toBeInTheDocument();

  const closeButton = getByRole('button');

  userEvent.click(closeButton);

  await waitFor(() => expect(queryByText(bannerText)).toBeNull());
});

it('should render review dismissed banner', async () => {
  const { queryByText, getByText, getByRole } = render(
    <SharedResearchOutputBanners
      {...defaultProps}
      reviewToggled={true}
      statusChangedBy={undefined}
    />,
  );

  const bannerText =
    'In review working group Article switched to draft successfully.';

  expect(getByText(bannerText)).toBeInTheDocument();

  const closeButton = getByRole('button');

  userEvent.click(closeButton);

  await waitFor(() => expect(queryByText(bannerText)).toBeNull());
});

it('should render review requested banner with association name', async () => {
  const { getByText } = render(
    <SharedResearchOutputBanners
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

it('should render published now banner', async () => {
  const { queryByText, getByText, getByRole } = render(
    <SharedResearchOutputBanners {...defaultProps} published publishedNow />,
  );

  const bannerText = 'Working Group Article published successfully.';

  expect(getByText(bannerText)).toBeInTheDocument();

  const closeButton = getByRole('button');

  userEvent.click(closeButton);

  await waitFor(() => expect(queryByText(bannerText)).toBeNull());
});

it('should render only PMs can publish output', async () => {
  const { getByText } = render(
    <SharedResearchOutputBanners
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
