import { gp2 } from '@asap-hub/model';
import { render, screen } from '@testing-library/react';
import UserRegion from '../UserRegion';

describe('UserRegion', () => {
  it.each(
    gp2.userRegions.filter((region) => region !== 'Australia/Australasia'),
  )('renders the right icon and name for %s', (region) => {
    render(<UserRegion region={region} />);
    expect(screen.getByTitle(region)).toBeInTheDocument();
    expect(screen.getByText(region, { selector: 'span' })).toBeInTheDocument();
  });
  it('renders the right icon and name for Australasia', () => {
    render(<UserRegion region={'Australia/Australasia'} />);
    expect(screen.getByTitle('Australasia')).toBeInTheDocument();
    expect(
      screen.getByText('Australia/Australasia', { selector: 'span' }),
    ).toBeInTheDocument();
  });
});
