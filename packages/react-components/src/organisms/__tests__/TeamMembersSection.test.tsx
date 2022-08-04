import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import TeamMembersSection from '../TeamMembersSection';

const props: ComponentProps<typeof TeamMembersSection> = {
  members: [],
};

it('renders the component with the default title and member count', () => {
  render(<TeamMembersSection {...props} members={[]} />);
  expect(screen.getByRole('heading').textContent).toMatchInlineSnapshot(
    `"Team Members (0)"`,
  );
});

it('renders the supplied title and member list', async () => {
  render(
    <TeamMembersSection
      title="Title"
      members={[
        {
          id: '42',
          firstName: 'Phillip',
          lastName: 'Mars',
          firstLine: 'Phillip Mars, PhD',
          secondLine: 'Collaborating PI',
          thirdLine: 'Mars lab',
        },
      ]}
    />,
  );

  expect(screen.getByText('Title')).toBeVisible();
  expect(screen.getByText('Phillip Mars, PhD')).toBeVisible();
  expect(screen.getByText('Collaborating PI')).toBeVisible();
  expect(screen.getByText('Mars lab')).toBeVisible();
});

it('renders a link when provided', async () => {
  render(
    <TeamMembersSection
      {...props}
      href="http://example.com"
      hrefText="Example"
    />,
  );

  expect(screen.getByText('Example').closest('a')).toHaveAttribute(
    'href',
    'http://example.com',
  );
});
