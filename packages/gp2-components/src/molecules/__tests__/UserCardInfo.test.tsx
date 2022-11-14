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
  it('renders working groups links', () => {
    render(
      <UserCardInfo
        {...defaultProps}
        workingGroups={[
          { id: '1', title: 'Working Group 1', members: [] },
          { id: '2', title: 'Working Group 2', members: [] },
        ]}
      />,
    );
    expect(
      screen.getAllByRole('link').map(({ textContent }) => textContent),
    ).toMatchObject(['Working Group 1', 'Working Group 2']);
  });
  it('renders Projects links', () => {
    render(
      <UserCardInfo
        {...defaultProps}
        projects={[
          { id: '1', title: 'Project 1', status: 'Inactive', members: [] },
          { id: '2', title: 'Project 2', status: 'Active', members: [] },
        ]}
      />,
    );
    expect(
      screen.getAllByRole('link').map(({ textContent }) => textContent),
    ).toMatchObject(['Project 1', 'Project 2']);
  });
});
