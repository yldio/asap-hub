import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import UserCardInfo from '../UserCardInfo';

const defaultProps: ComponentProps<typeof UserCardInfo> = {
  projects: [],
  workingGroups: [],
  role: 'GP2 Admin',
  region: 'Europe',
};

describe('UserCardInfo', () => {
  it('renders role', () => {
    render(<UserCardInfo {...defaultProps} />);
    expect(screen.getByTitle('Role').closest('div')).toHaveTextContent(
      'GP2 Admin',
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
          { id: '1', name: 'Working Group 1' },
          { id: '2', name: 'Working Group 2' },
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
          { id: '1', name: 'Project 1' },
          { id: '2', name: 'Project 2' },
        ]}
      />,
    );
    expect(
      screen.getAllByRole('link').map(({ textContent }) => textContent),
    ).toMatchObject(['Project 1', 'Project 2']);
  });
});
