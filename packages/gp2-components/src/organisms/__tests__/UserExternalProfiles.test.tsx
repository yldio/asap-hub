import { render } from '@testing-library/react';
import UserExternalProfiles from '../UserExternalProfiles';

describe('UserExternalProfiles', () => {
  const researchNetworks = {
    googleScholar: 'googleScholar',
    orcid: 'orcid',
  };

  const socialNetworks = {
    blog: 'blog',
    twitter: 'twitter',
    linkedIn: 'linkedIn',
    github: 'github',
  };

  it('renders research networks, social networks and a divider when both groups of networks are defined', () => {
    const props = {
      social: {
        ...researchNetworks,
        ...socialNetworks,
      },
    };

    const { queryByText, queryByRole } = render(
      <UserExternalProfiles {...props} />,
    );

    expect(queryByText('Research Networks')).toBeInTheDocument();
    expect(queryByRole('separator')).toBeInTheDocument();
    expect(queryByText('Social Networks')).toBeInTheDocument();
  });

  it('renders research networks without a divider when only research networks are defined', () => {
    const props = {
      social: {
        ...researchNetworks,
      },
    };

    const { queryByText, queryByRole } = render(
      <UserExternalProfiles {...props} />,
    );

    expect(queryByText('Research Networks')).toBeInTheDocument();
    expect(queryByRole('separator')).not.toBeInTheDocument();
    expect(queryByText('Social Networks')).not.toBeInTheDocument();
  });

  it('renders social networks without a divider when only social networks are defined', () => {
    const props = {
      social: {
        ...socialNetworks,
      },
    };

    const { queryByText, queryByRole } = render(
      <UserExternalProfiles {...props} />,
    );

    expect(queryByText('Research Networks')).not.toBeInTheDocument();
    expect(queryByRole('separator')).not.toBeInTheDocument();
    expect(queryByText('Social Networks')).toBeInTheDocument();
  });

  it('does not render any networks when none are defined', () => {
    const { queryByText } = render(<UserExternalProfiles />);

    expect(queryByText('Research Networks')).not.toBeInTheDocument();
    expect(queryByText('Social Networks')).not.toBeInTheDocument();
  });

  it('should filter networks that are not defined', () => {
    const props = {
      social: {
        googleScholar: 'googleScholar',
        twitter: 'twitter',
      },
    };

    const { getAllByRole } = render(<UserExternalProfiles {...props} />);

    const links = getAllByRole('link');
    expect(links.length).toBe(2);
    expect(links[0]).toHaveTextContent('Google Scholar');
    expect(links[1]).toHaveTextContent('Twitter');
  });
});
