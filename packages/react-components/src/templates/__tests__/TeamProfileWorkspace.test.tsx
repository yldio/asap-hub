import { createTeamResponse } from '@asap-hub/fixtures';
import { disable, enable } from '@asap-hub/flags';
import {
  getByText as getChildByText,
  render,
  waitFor,
} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ComponentProps } from 'react';

import TeamProfileWorkspace from '../TeamProfileWorkspace';

beforeEach(jest.clearAllMocks);

const team: ComponentProps<typeof TeamProfileWorkspace> = {
  ...createTeamResponse({ teamMembers: 1, tools: 0 }),
  tools: [],
};
it('renders the team workspace page', () => {
  const { getByRole } = render(<TeamProfileWorkspace {...team} tools={[]} />);

  expect(
    getByRole('heading', { name: 'Collaboration Tools (Team Only)' }),
  ).toBeInTheDocument();
});

it('renders compliance section when feature flag is enabled', () => {
  const teamWithManuscripts: ComponentProps<typeof TeamProfileWorkspace> = {
    ...team,
    manuscripts: [
      { id: '1', title: 'Nice manuscript' },
      { id: '2', title: 'A Good Manuscript' },
    ],
  };
  enable('DISPLAY_MANUSCRIPTS');
  const { container, getByRole, queryByRole, rerender } = render(
    <TeamProfileWorkspace {...teamWithManuscripts} tools={[]} />,
  );
  expect(getByRole('heading', { name: 'Compliance' })).toBeInTheDocument();
  expect(container).toHaveTextContent('Nice manuscript');
  expect(container).toHaveTextContent('A Good Manuscript');

  disable('DISPLAY_MANUSCRIPTS');
  rerender(<TeamProfileWorkspace {...teamWithManuscripts} tools={[]} />);
  expect(queryByRole('heading', { name: 'Compliance' })).toBeNull();
});

it('renders contact project manager when point of contact provided', () => {
  const { getByText } = render(
    <TeamProfileWorkspace
      {...team}
      pointOfContact={{
        displayName: 'Mr PM',
        firstName: 'Mr',
        lastName: 'PM',
        email: 'test@example.com',
        id: '123',
        role: 'Project Manager',
      }}
    />,
  );

  const link = getByText('Mr PM', {
    selector: 'a',
  }) as HTMLAnchorElement;

  expect(link.href).toContain('test@example.com');
  expect(getByText('Team Contact Email')).toBeVisible();
});

it('omits contact project manager when point of contact omitted', () => {
  const { queryByText } = render(
    <TeamProfileWorkspace {...team} pointOfContact={undefined} />,
  );

  expect(queryByText('Team Contact Email')).toBe(null);
});

describe('a tool', () => {
  it('is rendered when provided', () => {
    const { getByText } = render(
      <TeamProfileWorkspace
        {...team}
        tools={[
          {
            name: 'Signal',
            description: 'Our chat tool',
            url: 'https://signal.group/our',
          },
        ]}
      />,
    );

    expect(getByText('Signal')).toBeVisible();
  });

  it('has edit links', () => {
    const { getByText } = render(
      <TeamProfileWorkspace
        {...team}
        tools={[
          {
            name: 'Signal',
            description: 'Our chat tool',
            url: 'https://signal.group/our',
          },
          {
            name: 'Discord',
            description: 'Our call tool',
            url: 'https://discord.gg/our',
          },
        ]}
      />,
    );
    const signalCard = getByText('Signal').closest('li')!;
    expect(getChildByText(signalCard, /edit/i).closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(/\/0(\D|$)/),
    );
    const discordCard = getByText('Discord').closest('li')!;
    expect(getChildByText(discordCard, /edit/i).closest('a')).toHaveAttribute(
      'href',
      expect.stringMatching(/\/1(\D|$)/),
    );
  });

  it('has a delete button', async () => {
    const handleDeleteTool = jest.fn();
    const { getByText } = render(
      <TeamProfileWorkspace
        {...team}
        tools={[
          {
            name: 'Signal',
            description: 'Our chat tool',
            url: 'https://signal.group/our',
          },
          {
            name: 'Discord',
            description: 'Our call tool',
            url: 'https://discord.gg/our',
          },
        ]}
        onDeleteTool={handleDeleteTool}
      />,
    );
    const discordCard = getByText('Discord').closest('li')!;

    userEvent.click(getChildByText(discordCard, /delete/i));

    await waitFor(() => expect(handleDeleteTool).toHaveBeenCalledWith(1));
  });
});
