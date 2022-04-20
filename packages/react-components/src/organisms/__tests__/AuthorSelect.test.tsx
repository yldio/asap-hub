import { render, waitFor } from '@testing-library/react';
import { createUserResponse } from '@asap-hub/fixtures';
import userEvent from '@testing-library/user-event';
import AuthorSelect from '../AuthorSelect';

it('renders a author multi select, passing through props for user', () => {
  const { getByText, getByLabelText } = render(
    <AuthorSelect
      title="Title"
      subtitle="Subtitle"
      description="Description"
      suggestions={[
        { label: 'Value', value: 'Value', user: createUserResponse() },
      ]}
      values={[
        {
          user: {
            ...createUserResponse(),
            firstName: 'Andy',
            lastName: 'Smith',
          },
          label: 'Andy Smith',
          value: 'user-id',
        },
      ]}
    />,
  );
  expect(getByLabelText(/Title/i)).toBeVisible();
  expect(getByLabelText(/Subtitle/i)).toBeVisible();
  expect(getByLabelText(/Description/i)).toBeVisible();
  expect(getByText('Andy Smith')).toBeVisible();
  expect(getByText('AS')).toBeVisible();
});

it('renders a author multi select, passing through props for user with avatar', () => {
  const { getByRole, getByText, getByLabelText } = render(
    <AuthorSelect
      title="Title"
      subtitle="Subtitle"
      description="Description"
      suggestions={[
        { label: 'Value', value: 'Value', user: createUserResponse() },
      ]}
      values={[
        {
          user: {
            ...createUserResponse(),
            firstName: 'Andy',
            lastName: 'Smith',
            avatarUrl: 'avatar.png',
          },
          label: 'Andy Smith',
          value: 'user-id',
        },
      ]}
    />,
  );
  expect(getByLabelText(/Title/i)).toBeVisible();
  expect(getByLabelText(/Subtitle/i)).toBeVisible();
  expect(getByLabelText(/Description/i)).toBeVisible();
  expect(getByText('Andy Smith')).toBeVisible();
  const { backgroundImage } = getComputedStyle(getByRole('img'));
  expect(backgroundImage).toContain('url(avatar.png)');
});

it('renders a author multi select, passing through props for external author', () => {
  const { getByText, getByTitle, getByLabelText } = render(
    <AuthorSelect
      title="Title"
      subtitle="Subtitle"
      description="Description"
      suggestions={[
        { label: 'Value', value: 'Value', user: createUserResponse() },
      ]}
      values={[
        {
          user: {
            id: 'external-author-id',
            displayName: 'Andy Smith',
          },
          label: 'Andy Smith',
          value: 'external-author-id',
        },
      ]}
    />,
  );
  expect(getByLabelText(/Title/i)).toBeVisible();
  expect(getByLabelText(/Subtitle/i)).toBeVisible();
  expect(getByLabelText(/Description/i)).toBeVisible();
  expect(getByText('Andy Smith (Non CRN)')).toBeVisible();
  expect(getByTitle('User Placeholder')).toBeInTheDocument();
});

it('renders a new author option for new values', async () => {
  const { getByRole, queryByText, getByText } = render(
    <AuthorSelect
      title="Title"
      subtitle="Subtitle"
      description="Description"
      loadOptions={jest.fn().mockResolvedValue([])}
    />,
  );

  userEvent.type(getByRole('textbox'), 'Chris B');

  await waitFor(() => {
    expect(queryByText(/loading/i)).not.toBeInTheDocument();
  });

  expect(getByText(/Chris B/i, { selector: 'strong' })).toBeVisible();
  expect(getByText(/(Non CRN)/i, { selector: 'span' })).toBeVisible();
});

it('renders an author multi select, passing through props for new external author', () => {
  const { getByText } = render(
    <AuthorSelect
      title="Title"
      subtitle="Subtitle"
      description="Description"
      loadOptions={jest.fn().mockResolvedValue([])}
      values={[
        {
          label: 'Chris White',
          value: 'Chris White',
        },
      ]}
    />,
  );

  expect(getByText('Chris White (Non CRN)')).toBeVisible();
});
