import { UserProfileContext } from '@asap-hub/react-context';
import { render } from '@testing-library/react';
import UserProfileRecentWorks from '../UserProfileRecentWorks';

it('is not rendered when there are no works', () => {
  const { container } = render(<UserProfileRecentWorks />);
  expect(container).toBeEmptyDOMElement();
});

it('shows placeholder when no works and your own profile', () => {
  const { getByRole, getByText } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileRecentWorks orcid="123-123-123" />
    </UserProfileContext.Provider>,
  );

  expect(getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Recent Publications (0)"`,
  );
  expect(getByText('123-123-123').closest('a')).toHaveAttribute(
    'href',
    expect.stringMatching(/123-123-123/),
  );
});

it('shows works when work are provided for your own profile', () => {
  const { getByText } = render(
    <UserProfileContext.Provider value={{ isOwnProfile: true }}>
      <UserProfileRecentWorks
        orcidWorks={[
          {
            title: 'Title',
            type: 'BOOK' as const,
            publicationDate: {},
            lastModifiedDate: '1478865224685',
          },
        ]}
      />
    </UserProfileContext.Provider>,
  );
  expect(getByText(/title/i)).toBeVisible();
});

it('renders the content', async () => {
  const { queryByText, getByText } = render(
    <UserProfileRecentWorks
      orcidWorks={[
        {
          title: 'Title',
          type: 'BOOK' as const,
          publicationDate: {},
          lastModifiedDate: '1478865224685',
        },
      ]}
    />,
  );

  expect(getByText(/title/i)).toBeVisible();
  expect(queryByText(/published/i)).not.toBeInTheDocument();
});

it('renders content with a link to external resource', async () => {
  const { getByRole } = render(
    <UserProfileRecentWorks
      orcidWorks={[
        {
          doi: 'https://hub.asap.science',
          title: 'Title',
          type: 'BOOK' as const,
          publicationDate: {
            year: '2020',
            month: '05',
            day: '12',
          },
          lastModifiedDate: '1478865224685',
        },
      ]}
    />,
  );

  expect(getByRole('link')).toHaveAttribute('href', 'https://hub.asap.science');
});

it('renders date with just the year', async () => {
  const { getByText } = render(
    <UserProfileRecentWorks
      orcidWorks={[
        {
          title: 'Title',
          type: 'BOOK' as const,
          publicationDate: {
            year: '2020',
          },
          lastModifiedDate: '1478865224685',
        },
      ]}
    />,
  );

  expect(getByText(/title/i)).toBeVisible();
  expect(getByText(/published/i).textContent).toMatchInlineSnapshot(
    `"Originally Published: 2020"`,
  );
});

it('renders date with month and year', async () => {
  const { getByText } = render(
    <UserProfileRecentWorks
      orcidWorks={[
        {
          title: 'Title',
          type: 'BOOK' as const,
          publicationDate: {
            year: '2020',
            month: '05',
          },
          lastModifiedDate: '1478865224685',
        },
      ]}
    />,
  );

  expect(getByText(/title/i)).toBeVisible();
  expect(getByText(/published/i).textContent).toMatchInlineSnapshot(
    `"Originally Published: May 2020"`,
  );
});

it('renders date with day, month and year', async () => {
  const { getByText } = render(
    <UserProfileRecentWorks
      orcidWorks={[
        {
          title: 'Title',
          type: 'BOOK' as const,
          publicationDate: {
            year: '2020',
            month: '05',
            day: '12',
          },
          lastModifiedDate: '1478865224685',
        },
      ]}
    />,
  );

  expect(getByText(/title/i)).toBeVisible();
  expect(getByText(/published/i).textContent).toMatchInlineSnapshot(
    `"Originally Published: 12th May 2020"`,
  );
});
