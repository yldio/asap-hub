import { render } from '@testing-library/react';

import UserAvatar from '../UserAvatar';

const mockIsEnabled = jest.fn();
jest.mock('@asap-hub/react-context', () => ({
  ...jest.requireActual('@asap-hub/react-context'),
  useFlags: () => ({ isEnabled: mockIsEnabled }),
}));

describe('member avatar award badge', () => {
  beforeEach(() => {
    mockIsEnabled.mockReturnValue(true);
  });

  const latestAward = {
    name: 'Open Science Champion',
    date: '2024-01-01',
    iconUrl: 'new',
  };

  it('displays avatar with badge if user has a latest award', () => {
    const { getByAltText } = render(
      <UserAvatar firstName="Bat" lastName="Man" latestAward={latestAward} />,
    );

    const badge = getByAltText('Open Science Champion');
    expect(badge).toHaveAttribute('src', 'new');
  });

  it('does not render an award badge when the user has none', () => {
    const { queryByAltText } = render(
      <UserAvatar firstName="Bat" lastName="Man" latestAward={undefined} />,
    );

    expect(queryByAltText('Open Science Champion')).not.toBeInTheDocument();
  });

  it('does not render an award badge when the latest award has no icon', () => {
    const { queryByAltText } = render(
      <UserAvatar
        firstName="Bat"
        lastName="Man"
        latestAward={{ name: 'Open Science Champion', date: '2024-01-01' }}
      />,
    );

    expect(queryByAltText('Open Science Champion')).not.toBeInTheDocument();
  });

  it('does not render an award badge when STAGING_MODE is disabled', () => {
    mockIsEnabled.mockReturnValue(false);
    const { queryByAltText } = render(
      <UserAvatar firstName="Bat" lastName="Man" latestAward={latestAward} />,
    );

    expect(queryByAltText('Open Science Champion')).not.toBeInTheDocument();
  });
});
