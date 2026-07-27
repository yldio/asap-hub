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

  it('displays avatar with badge if a badge url is provided', () => {
    const { getByAltText } = render(
      <UserAvatar
        firstName="Bat"
        lastName="Man"
        badgeUrl="https://example.com"
        badgeAlt="Open Science Champion"
      />,
    );

    const badge = getByAltText('Open Science Champion');
    expect(badge).toHaveAttribute('src', 'https://example.com');
  });

  it('does not render an award badge when no badge url is provided', () => {
    const { queryByAltText } = render(
      <UserAvatar
        firstName="Bat"
        lastName="Man"
        badgeUrl={undefined}
        badgeAlt="Open Science Champion"
      />,
    );

    expect(queryByAltText('Open Science Champion')).not.toBeInTheDocument();
  });

  it('does not render an award badge when STAGING_MODE is disabled', () => {
    mockIsEnabled.mockReturnValue(false);
    const { queryByAltText } = render(
      <UserAvatar
        firstName="Bat"
        lastName="Man"
        badgeUrl="https://example.com"
        badgeAlt="Open Science Champion"
      />,
    );

    expect(queryByAltText('Open Science Champion')).not.toBeInTheDocument();
  });
});
