import SharedResearchOutputBanners, {
  SharedResearchOutputBannersProps,
} from '../SharedResearchOutputBanners';
import { render, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

const defaultProps: SharedResearchOutputBannersProps = {
  association: 'working group',
  documentType: 'Article',
  published: false,
  reviewRequestedBy: undefined,
  publishedNow: false,
  draftCreated: false,
  reviewToggled: false,
  associationName: 'Association Name',
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
      reviewRequestedBy={{
        id: 'user-id',
        firstName: 'First',
        lastName: 'Last',
      }}
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
      reviewRequestedBy={undefined}
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
      reviewRequestedBy={{
        id: 'user-id',
        firstName: 'First',
        lastName: 'Last',
      }}
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
      reviewRequestedBy={undefined}
    />,
  );

  expect(
    getByText(
      'This draft is available to members in the working group listed below. Only PMs can publish this output.',
    ),
  ).toBeInTheDocument();
});
