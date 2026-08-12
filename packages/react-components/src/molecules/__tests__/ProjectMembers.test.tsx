import { render, screen } from '@testing-library/react';
import { ProjectMember } from '@asap-hub/model';
import ProjectMembers from '../ProjectMembers';

const mockMembers: ProjectMember[] = [
  {
    id: '1',
    displayName: 'John Doe',
    firstName: 'John',
    lastName: 'Doe',
    role: 'Principal Investigator',
    href: '/users/john-doe',
  },
  {
    id: '2',
    displayName: 'Jane Smith',
    firstName: 'Jane',
    lastName: 'Smith',
    role: 'Co-Investigator',
    href: '/users/jane-smith',
  },
  {
    id: '3',
    displayName: 'Michael Johnson',
    firstName: 'Michael',
    lastName: 'Johnson',
    role: 'Research Associate',
    href: '/users/michael-johnson',
  },
];

describe('ProjectMembers', () => {
  it('renders all members', () => {
    render(<ProjectMembers members={mockMembers} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('Jane Smith')).toBeInTheDocument();
    expect(screen.getByText('Michael Johnson')).toBeInTheDocument();
  });

  it('renders member roles', () => {
    render(<ProjectMembers members={mockMembers} />);
    expect(screen.getByText('Principal Investigator')).toBeInTheDocument();
    expect(screen.getByText('Co-Investigator')).toBeInTheDocument();
    expect(screen.getByText('Research Associate')).toBeInTheDocument();
  });

  it('renders a member whose role is unset with "No role assigned"', () => {
    const membersWithOneRoleless: ProjectMember[] = [
      ...mockMembers,
      { id: '4', displayName: 'Pat Roleless', href: '/users/pat-roleless' },
    ];
    render(<ProjectMembers members={membersWithOneRoleless} />);
    expect(screen.getByText('Pat Roleless')).toBeInTheDocument();
    expect(screen.getByText('No role assigned')).toBeVisible();
  });

  it('renders empty state with empty array', () => {
    const { container } = render(<ProjectMembers members={[]} />);
    expect(container.firstChild).toBeEmptyDOMElement();
  });

  it('renders single member', () => {
    render(<ProjectMembers members={[mockMembers[0]!]} />);
    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.queryByText('Jane Smith')).not.toBeInTheDocument();
  });

  it('renders all member links correctly', () => {
    render(<ProjectMembers members={mockMembers} />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(mockMembers.length);
    expect(links[0]).toHaveAttribute('href', mockMembers[0]!.href);
    expect(links[1]).toHaveAttribute('href', mockMembers[1]!.href);
    expect(links[2]).toHaveAttribute('href', mockMembers[2]!.href);
  });
});
