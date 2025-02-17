import { render, screen } from '@testing-library/react';
import { ComponentProps } from 'react';
import ComplianceControls from '../ComplianceControls';

describe('ComplianceControls', () => {
  const props: ComponentProps<typeof ComplianceControls> = {
    currentPageIndex: 1,
    numberOfPages: 5,
    renderPageHref: (page: number) => `/base-path/${page}`,
    completedStatus: 'hide' as const,
    requestedAPCCoverage: 'submitted' as const,
    isComplianceReviewer: true,
    selectedStatuses: [],
    onSelectStatus: () => {},
  };

  it('renders completed status dropdown with correct selected option', () => {
    render(<ComplianceControls {...props} />);

    expect(screen.getByText('Completed Status:')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Hide Chevron Down' }),
    ).toBeInTheDocument();
  });

  it('renders requested APC coverage dropdown with correct selectedoption', () => {
    render(<ComplianceControls {...props} />);

    expect(screen.getByText('Requested APC Coverage:')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'Submitted Chevron Down' }),
    ).toBeInTheDocument();
  });

  it('generates correct href for completed status options, requested APC coverage options and selected statuses', () => {
    render(
      <ComplianceControls
        {...props}
        selectedStatuses={[
          'Waiting for Report',
          'Compliant',
          'Submit Final Publication',
        ]}
      />,
    );

    expect(screen.getByText('Show').closest('a')).toHaveAttribute(
      'href',
      '/base-path/1?completedStatus=show&requestedAPCCoverage=submitted&currentPage=1&status=Waiting+for+Report&status=Compliant&status=Submit+Final+Publication',
    );
  });
});
