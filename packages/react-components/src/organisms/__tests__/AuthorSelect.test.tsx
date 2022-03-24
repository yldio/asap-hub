import { render } from '@testing-library/react';
import { createUserResponse } from '@asap-hub/fixtures';
import AuthorSelect from '../AuthorSelect';

it('renders a author multi select, passing through props for user', () => {
  const { getByText, getByLabelText } = render(
    <AuthorSelect
      title="Title"
      subtitle="Subtitle"
      description="Description"
      suggestions={['Value']}
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
      suggestions={['Value']}
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
  const { getByText, getByLabelText } = render(
    <AuthorSelect
      title="Title"
      subtitle="Subtitle"
      description="Description"
      suggestions={['Value']}
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
  expect(getByText('Andy Smith')).toBeVisible();
  expect(getByText('AS')).toBeVisible();
});
