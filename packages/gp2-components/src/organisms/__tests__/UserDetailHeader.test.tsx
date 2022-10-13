import { render, screen } from '@testing-library/react';
import UserDetailHeader from '../UserDetailHeader';

describe('UserDetailHeader', () => {
  const position = {
    role: 'Safety Inspector',
    department: 'Sector 7G',
    institution: 'Springfield Nuclear Power Plant',
  };
  const defaultProps = {
    backHref: '/back',
    id: '1',
    displayName: 'Homer Simpson',
    firstName: 'Homer',
    lastName: 'Simpson',
    degrees: ['PhD' as const],
    role: 'Administrator' as const,
    region: 'Europe' as const,
    positions: [position],
    country: 'USA',
    city: 'Springfield',
  };
  it('renders only the name', () => {
    render(<UserDetailHeader {...defaultProps} degrees={[]} />);
    expect(
      screen.getByRole('heading', { name: 'Homer Simpson' }),
    ).toBeVisible();
  });

  it('renders name and degree', () => {
    const { rerender } = render(<UserDetailHeader {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Homer Simpson, PhD' }),
    ).toBeVisible();
    rerender(<UserDetailHeader {...defaultProps} degrees={['MD', 'PhD']} />);
    expect(screen.getByText('Homer Simpson, MD, PhD')).toBeInTheDocument();
  });
  it('renders the avatar', () => {
    render(<UserDetailHeader {...defaultProps} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  it('renders back link', () => {
    render(<UserDetailHeader {...defaultProps} />);
    expect(
      screen.getByRole('link', { name: 'Chevron Left Back' }),
    ).toHaveAttribute('href', '/back');
  });
  it('renders user info', () => {
    render(<UserDetailHeader {...defaultProps} />);
    expect(screen.getByText('Administrator')).toBeInTheDocument();
    expect(
      screen.getByText('Europe', { selector: 'span' }),
    ).toBeInTheDocument();
  });
  it('renders user city and country', () => {
    render(<UserDetailHeader {...defaultProps} />);
    expect(screen.getByText('Springfield, USA')).toBeInTheDocument();
  });
  it('renders only the country', () => {
    render(<UserDetailHeader {...defaultProps} city={undefined} />);
    expect(screen.getByText('USA')).toBeInTheDocument();
  });
  it('renders the position', () => {
    render(<UserDetailHeader {...defaultProps} />);
    expect(
      screen.getByText(
        'Safety Inspector in Sector 7G at Springfield Nuclear Power Plant',
      ),
    ).toBeInTheDocument();
  });
  it('renders the positions', () => {
    render(
      <UserDetailHeader
        {...defaultProps}
        positions={[
          position,
          {
            role: 'Car designer',
            department: 'Design',
            institution: 'Powell Motors',
          },
        ]}
      />,
    );
    expect(
      screen.getByText(
        'Safety Inspector in Sector 7G at Springfield Nuclear Power Plant',
      ),
    ).toBeInTheDocument();
    expect(
      screen.getByText('Car designer in Design at Powell Motors'),
    ).toBeInTheDocument();
  });
});
