import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import ComplianceControls from '../ComplianceControls';

describe('ComplianceControls', () => {
  const props: ComponentProps<typeof ComplianceControls> = {
    completedStatus: 'hide' as const,
    requestedAPCCoverage: 'all' as const,
    manuscriptCount: 1,
    generateLink: () => '',
  };

  it('renders manuscript count with correct text when there is only one result', () => {
    render(<ComplianceControls {...props} />);

    expect(screen.getByText('1 result found')).toBeInTheDocument();
  });

  it('renders manuscript count with correct text when there are multiple results', () => {
    render(<ComplianceControls {...props} manuscriptCount={32} />);

    expect(screen.getByText('32 results found')).toBeInTheDocument();
  });

  it('renders completed status dropdown with correct selected option', () => {
    render(<ComplianceControls {...props} />);

    expect(screen.getByText('Completed Status:')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Hide Chevron Down' }),
    ).toBeInTheDocument();
  });

  it('renders APC Coverage dropdown with correct selectedoption', () => {
    render(<ComplianceControls {...props} />);

    expect(screen.getByText('APC Coverage:')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Show all Chevron Down' }),
    ).toBeInTheDocument();
  });

  it('renders export csv button', () => {
    const mockExport = jest.fn(() => Promise.resolve());

    render(<ComplianceControls {...props} exportResults={mockExport} />);

    expect(screen.getByText(/export as:/i)).toBeVisible();
  });
});
