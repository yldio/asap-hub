import { render, screen } from '@testing-library/react';
import { LabIcon } from '@asap-hub/react-components';
import InfoCard from '../InfoCard';

describe('InfoCard', () => {
  it('should render the icon, the title and the number', () => {
    render(<InfoCard icon={<LabIcon />} title="Lab Icon" total={200} />);
    expect(screen.getByRole('heading', { name: '200' })).toBeVisible();
    expect(screen.getByTitle('Lab')).toBeInTheDocument();
    expect(screen.getByText('Lab Icon')).toBeVisible();
  });
});
