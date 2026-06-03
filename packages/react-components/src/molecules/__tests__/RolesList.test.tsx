import { render, screen } from '@testing-library/react';
import RolesList from '../RolesList';

describe('RolesList', () => {
  it('renders nothing for empty roles', () => {
    const { container } = render(<RolesList roles={[]} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders single role without overflow badge', () => {
    render(<RolesList roles={['Lead PI (Core Leadership)']} />);
    expect(screen.getByText('Lead PI (Core Leadership)')).toBeVisible();
    expect(screen.queryByText(/\+/)).not.toBeInTheDocument();
  });

  it('renders three roles with +1 overflow badge', () => {
    render(
      <RolesList
        roles={[
          'Lead PI (Core Leadership)',
          'Project Manager',
          'Collaborating PI',
        ]}
      />,
    );
    expect(screen.getByText('Lead PI (Core Leadership)')).toBeVisible();
    expect(screen.getByText(/Project Manager/)).toBeVisible();
    expect(screen.getByText('+1')).toBeVisible();
    expect(screen.queryByText('Collaborating PI')).not.toBeInTheDocument();
  });

  it('respects custom maxVisible', () => {
    render(
      <RolesList
        roles={['Role A', 'Role B', 'Role C', 'Role D']}
        maxVisible={3}
      />,
    );
    expect(screen.getByText('Role A')).toBeVisible();
    expect(screen.getByText('Role B')).toBeVisible();
    expect(screen.getByText(/Role C/)).toBeVisible();
    expect(screen.getByText('+1')).toBeVisible();
    expect(screen.queryByText('Role D')).not.toBeInTheDocument();
  });
});
