import { render, fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AssignedUsersAvatarList, {
  getRemainingMembersText,
  Member,
} from '../AssignedUsersAvatarList';

describe('AssignedUsersAvatarList', () => {
  const mockMembers: Member[] = [
    {
      id: '1',
      firstName: 'Taylor',
      lastName: 'Swift',
      avatarUrl: 'http://example.com/avatar1.jpg',
    },
    {
      id: '2',
      firstName: 'Sabrina',
      lastName: 'Carpenter',
      avatarUrl: 'http://example.com/avatar2.jpg',
    },
    {
      id: '3',
      firstName: 'Billie',
      lastName: 'Eilish',
      avatarUrl: 'http://example.com/avatar3.jpg',
    },
    {
      id: '4',
      firstName: 'Ariana',
      lastName: 'Grande',
      avatarUrl: 'http://example.com/avatar4.jpg',
    },
  ];

  it('renders correctly with 2 or fewer members', () => {
    const twoMembers = mockMembers.slice(0, 2);
    render(<AssignedUsersAvatarList members={twoMembers} />);

    expect(
      screen.getByLabelText('Profile picture of Taylor Swift'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Profile picture of Sabrina Carpenter'),
    ).toBeInTheDocument();

    expect(
      screen.queryByLabelText(/Profile picture placeholder: \+1/),
    ).not.toBeInTheDocument();
  });

  it('renders correctly with more than MAX_USER_AVATARS members', () => {
    render(<AssignedUsersAvatarList members={mockMembers} />);

    expect(
      screen.getByLabelText('Profile picture of Taylor Swift'),
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText('Profile picture of Sabrina Carpenter'),
    ).toBeInTheDocument();

    expect(
      screen.getByLabelText(/Profile picture placeholder: \+2/),
    ).toBeInTheDocument();
  });

  it('shows tooltip with remaining members on hover', () => {
    render(<AssignedUsersAvatarList members={mockMembers} />);

    const tooltipText = /Billie Eilish and/i;
    expect(screen.getByText(tooltipText)).not.toBeVisible();

    const plusAvatar = screen.getByLabelText(
      /Profile picture placeholder: \+2/,
    );
    await userEvent.hover(plusAvatar.parentElement!);

    expect(screen.getByText(tooltipText)).toBeVisible();

    fireEvent.mouseLeave(plusAvatar.parentElement!);
    expect(screen.getByText(tooltipText)).not.toBeVisible();
  });

  it('renders correct links for user avatars', () => {
    render(<AssignedUsersAvatarList members={mockMembers.slice(0, 2)} />);

    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(2);
    expect(links[0]).toHaveAttribute('href', '/network/users/1');
    expect(links[1]).toHaveAttribute('href', '/network/users/2');
  });

  describe('getRemainingMembersText', () => {
    it('formats single member correctly', () => {
      const result = getRemainingMembersText([mockMembers[0]!]);
      expect(result).toBe('Taylor Swift');
    });

    it('formats two members correctly', () => {
      const result = getRemainingMembersText([
        mockMembers[0]!,
        mockMembers[1]!,
      ]);
      expect(result).toBe('Taylor Swift and\nSabrina Carpenter');
    });

    it('formats three members correctly', () => {
      const result = getRemainingMembersText([
        mockMembers[0]!,
        mockMembers[1]!,
        mockMembers[2]!,
      ]);
      expect(result).toBe(
        'Taylor Swift,\nSabrina Carpenter and\nBillie Eilish',
      );
    });

    it('formats four members correctly', () => {
      const result = getRemainingMembersText(mockMembers);
      expect(result).toBe(
        'Taylor Swift,\nSabrina Carpenter,\nBillie Eilish and\nAriana Grande',
      );
    });
  });
});
