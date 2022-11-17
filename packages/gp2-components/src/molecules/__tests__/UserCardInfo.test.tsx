import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import UserCardInfo from '../UserCardInfo';

const defaultProps: ComponentProps<typeof UserCardInfo> = {
  projects: [],
  workingGroups: [],
  role: 'Network Investigator',
  region: 'Europe',
};

describe('UserCardInfo', () => {
  it('renders role', () => {
    render(<UserCardInfo {...defaultProps} />);
    expect(screen.getByTitle('Role').closest('div')).toHaveTextContent(
      'Network Investigator',
    );
  });
  it('renders region', () => {
    render(<UserCardInfo {...defaultProps} />);
    expect(screen.getByTitle('Europe').closest('div')).toHaveTextContent(
      'Europe',
    );
  });
  it('renders empty working groups section', () => {
    render(<UserCardInfo {...defaultProps} />);
    expect(
      screen.getByTitle('Working Groups').closest('div')?.textContent,
    ).toContain(`This member isn’t part of any working groups`);
  });
  it('renders empty projects section', () => {
    render(<UserCardInfo {...defaultProps} />);
    expect(screen.getByTitle('Projects').closest('div')?.textContent).toContain(
      `This member isn’t part of any projects`,
    );
  });
  it('renders working groups links in alphabetical order', () => {
    render(
      <UserCardInfo
        {...defaultProps}
        workingGroups={[
          { id: '3', title: 'Working Group 3', members: [] },
          { id: '1', title: 'Working Group 1', members: [] },
          { id: '2', title: 'Working Group 2', members: [] },
        ]}
      />,
    );
    expect(
      screen.getAllByRole('link').map(({ textContent }) => textContent),
    ).toMatchObject(['Working Group 1', 'Working Group 2', 'Working Group 3']);
  });
  it('renders Projects links in alphabetical order', () => {
    render(
      <UserCardInfo
        {...defaultProps}
        projects={[
          { id: '3', title: 'Project 3', status: 'Active', members: [] },
          { id: '1', title: 'Project 1', status: 'Inactive', members: [] },
          { id: '2', title: 'Project 2', status: 'Active', members: [] },
        ]}
      />,
    );
    expect(
      screen.getAllByRole('link').map(({ textContent }) => textContent),
    ).toMatchObject(['Project 1', 'Project 2', 'Project 3']);
  });
});
