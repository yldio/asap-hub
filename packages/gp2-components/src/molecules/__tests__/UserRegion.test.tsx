import { render, screen } from '@testing-library/react';
import UserRegion from '../UserRegion';

describe('UserRegion', () => {
  it.each`
    region
    ${'Africa'}
    ${'Asia'}
    ${'Australasia'}
    ${'Europe'}
    ${'North America'}
    ${'Latin America'}
    ${'South America'}
  `('renders the right icon and name for $region', ({ region }) => {
    render(<UserRegion region={region} />);
    expect(screen.getByTitle(region)).toBeInTheDocument();
    expect(screen.getByText(region, { selector: 'span' })).toBeInTheDocument();
  });
});
