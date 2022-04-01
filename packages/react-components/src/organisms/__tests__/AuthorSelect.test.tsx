import { render } from '@testing-library/react';
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

it('supports adding new authors', async () => {
  const { getByText, getByRole } = render(
    <AuthorSelect
      title="Title"
      subtitle="Subtitle"
      description="Description"
      creatable={true}
      suggestions={[{ label: 'chris', value: 'chris', isNew: true }]}
      values={[]}
    />,
  );

  userEvent.click(getByRole('textbox'));
  expect(getByText(/chris/i, { selector: 'strong' })).toBeVisible();
  expect(getByText(/(Non CRN)/i, { selector: 'span' })).toBeVisible();
});

it('renders a author multi select, passing through props for new external author', () => {
  const { getByText } = render(
    <AuthorSelect
      title="Title"
      subtitle="Subtitle"
      description="Description"
      suggestions={[]}
      values={[
        {
          isNew: true,
          label: 'Chris Adams',
          value: 'Chris Adams',
        },
      ]}
    />,
  );

  expect(getByText('Chris Adams (Non CRN)')).toBeVisible();
});
