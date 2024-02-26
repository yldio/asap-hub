import { gp2 } from '@asap-hub/model';
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
    stateOrProvince: 'Massachusetts',
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

  it('shows user location', () => {
    const { container, getByTitle } = render(
      <UserDetailHeaderCard {...defaultProps} />,
    );
    expect(container).toHaveTextContent('Springfield, Massachusetts, USA');
    expect(getByTitle(/location/i)).toBeInTheDocument();
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
  it('renders upload button for avatar', () => {
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
    expect(onImageSelect).toHaveBeenCalledWith(testFile);
  });
  describe('when passing a editHref', () => {
    it('renders edit button when information is complete', () => {
      render(<UserDetailHeaderCard {...defaultProps} editHref="/" />);
      expect(screen.getByRole('link', { name: /edit.+edit/i })).toBeVisible();
    });
    it('renders add button when information is incomplete', () => {
      render(
        <UserDetailHeaderCard {...defaultProps} editHref="/" degrees={[]} />,
      );
      expect(screen.getByRole('link', { name: /add.+add/i })).toBeVisible();
    });
  });

  describe('external profiles', () => {
    it('renders the external profile icons when user has social values defined', () => {
      const social = {
        orcid: '0000-0000-0000-0000',
        blueSky: 'blueSky',
        threads: 'threads',
        twitter: 'X',
        linkedIn: 'linkedin',
        github: 'github',
        researcherId: 'researcherId',
        googleScholar: 'googleScholar',
        researchGate: 'researchGate',
        blog: 'blog',
      } as gp2.UserSocial;

      render(<UserDetailHeaderCard {...defaultProps} social={social} />);

      expect(screen.getByTitle('ORCID')).toBeInTheDocument();
      expect(screen.getByTitle('Blue Sky')).toBeInTheDocument();
      expect(screen.getByTitle('Threads')).toBeInTheDocument();
      expect(screen.getByTitle('X')).toBeInTheDocument();
      expect(screen.getByTitle('LinkedIn')).toBeInTheDocument();
      expect(screen.getByTitle('GitHub')).toBeInTheDocument();
      expect(screen.getByTitle('ResearcherID')).toBeInTheDocument();
      expect(screen.getByTitle('Google Scholar')).toBeInTheDocument();
      expect(screen.getByTitle('Research Gate')).toBeInTheDocument();
      expect(screen.getByTitle('Website')).toBeInTheDocument();
    });

    it('does not render the external profile icons when user does not have any social defined', () => {
      render(<UserDetailHeaderCard {...defaultProps} />);

      expect(screen.queryByTitle('ORCID')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Blue Sky')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Threads')).not.toBeInTheDocument();
      expect(screen.queryByTitle('X')).not.toBeInTheDocument();
      expect(screen.queryByTitle('LinkedIn')).not.toBeInTheDocument();
      expect(screen.queryByTitle('GitHub')).not.toBeInTheDocument();
      expect(screen.queryByTitle('ResearcherID')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Google Scholar')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Research Gate')).not.toBeInTheDocument();
      expect(screen.queryByTitle('Website')).not.toBeInTheDocument();
    });
  });
});
