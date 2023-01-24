import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import UserDetailHeaderCard from '../UserDetailHeaderCard';

describe('UserDetailHeaderCard', () => {
  const position = {
    role: 'Safety Inspector',
    department: 'Sector 7G',
    institution: 'Springfield Nuclear Power Plant',
  };
  const defaultProps = {
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
    render(<UserDetailHeaderCard {...defaultProps} degrees={[]} />);
    expect(
      screen.getByRole('heading', { name: 'Homer Simpson' }),
    ).toBeVisible();
  });

  it('renders name and degree', () => {
    const { rerender } = render(<UserDetailHeaderCard {...defaultProps} />);
    expect(
      screen.getByRole('heading', { name: 'Homer Simpson, PhD' }),
    ).toBeVisible();
    rerender(
      <UserDetailHeaderCard {...defaultProps} degrees={['MD', 'PhD']} />,
    );
    expect(screen.getByText('Homer Simpson, MD, PhD')).toBeInTheDocument();
  });
  it('renders the avatar', () => {
    render(<UserDetailHeaderCard {...defaultProps} />);
    expect(screen.getByRole('img')).toBeInTheDocument();
  });
  it('renders user info', () => {
    render(<UserDetailHeaderCard {...defaultProps} />);
    expect(screen.getByText('Administrator')).toBeInTheDocument();
    expect(
      screen.getByText('Europe', { selector: 'span' }),
    ).toBeInTheDocument();
  });
  it('renders user city and country', () => {
    render(<UserDetailHeaderCard {...defaultProps} />);
    expect(screen.getByText('Springfield, USA')).toBeInTheDocument();
  });
  it('renders only the country', () => {
    render(<UserDetailHeaderCard {...defaultProps} city={undefined} />);
    expect(screen.getByText('USA')).toBeInTheDocument();
  });
  it('renders the position', () => {
    render(<UserDetailHeaderCard {...defaultProps} />);
    expect(
      screen.getByText(
        'Safety Inspector in Sector 7G at Springfield Nuclear Power Plant',
      ),
    ).toBeInTheDocument();
  });
  it('renders the positions', () => {
    render(
      <UserDetailHeaderCard
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
  it('renders upload buttton for avatar', () => {
    const onImageSelect = jest.fn((file: File) => {});
    const testFile = new File(['foo'], 'foo.png', { type: 'image/png' });
    render(
      <UserDetailHeaderCard {...defaultProps} onImageSelect={onImageSelect} />,
    );
    const editButton = screen.getByLabelText(/edit.+avatar/i);
    const uploadInput = screen.getByLabelText(/upload.+avatar/i);
    expect(editButton).toBeVisible();
    expect(uploadInput).not.toHaveAttribute('disabled');
    userEvent.upload(uploadInput, testFile);
    expect(onImageSelect).toBeCalledWith(testFile);
  });
  describe('when passing a editHref', () => {
    it('renders edit button when information is complete', () => {
      render(<UserDetailHeaderCard {...defaultProps} editHref="/" />);
      expect(screen.getByRole('link', { name: /edit.+edit/i })).toBeVisible();
    });
    it('renders required button when information is incomplete', () => {
      render(
        <UserDetailHeaderCard {...defaultProps} editHref="/" degrees={[]} />,
      );
      expect(
        screen.getByRole('link', { name: /required.+add/i }),
      ).toBeVisible();
    });
  });
});
