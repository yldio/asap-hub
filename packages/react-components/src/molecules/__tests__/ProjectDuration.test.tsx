import { render } from '@testing-library/react';
import ProjectDuration from '../ProjectDuration';

describe('ProjectDuration', () => {
  it('renders start and end dates', () => {
    const { getByText } = render(
      <ProjectDuration startDate="2023-01-15" endDate="2025-12-31" />,
    );
    expect(getByText(/Jan 2023/)).toBeVisible();
    expect(getByText(/Dec 2025/)).toBeVisible();
  });

  it('displays duration in months when less than 12 months', () => {
    const { getByText } = render(
      <ProjectDuration startDate="2023-01-15" endDate="2023-06-15" />,
    );
    expect(getByText(/5 mos/)).toBeVisible();
  });

  it('displays duration in months as "mos" abbreviation', () => {
    const { getByText } = render(
      <ProjectDuration startDate="2023-01-15" endDate="2023-11-15" />,
    );
    expect(getByText(/10 mos/)).toBeVisible();
  });

  it('displays duration as "1 yr" (singular) for exactly 12 months', () => {
    const { getByText } = render(
      <ProjectDuration startDate="2023-01-15" endDate="2024-01-15" />,
    );
    expect(getByText(/1 yr/)).toBeVisible();
    expect(getByText(/1 yr/)).not.toHaveTextContent('yrs');
  });

  it('displays duration as "yrs" (plural) for more than 12 months', () => {
    const { getByText } = render(
      <ProjectDuration startDate="2023-01-15" endDate="2025-12-31" />,
    );
    // Jan 2023 to Dec 2025 is approximately 35-36 months = 2-3 years
    expect(getByText(/[23] yrs/)).toBeVisible();
  });

  it('displays duration for a 2-year project', () => {
    const { getByText } = render(
      <ProjectDuration startDate="2023-01-15" endDate="2025-01-15" />,
    );
    expect(getByText(/2 yrs/)).toBeVisible();
  });

  it('displays duration for a 5-year project', () => {
    const { getByText } = render(
      <ProjectDuration startDate="2020-01-15" endDate="2025-01-15" />,
    );
    expect(getByText(/5 yrs/)).toBeVisible();
  });

  it('handles edge case of less than 1 month', () => {
    const { getByText } = render(
      <ProjectDuration startDate="2023-01-15" endDate="2023-01-20" />,
    );
    expect(getByText(/0 mos/)).toBeVisible();
  });

  it('renders the clock icon', () => {
    const { container } = render(
      <ProjectDuration startDate="2023-01-15" endDate="2024-01-15" />,
    );
    // Check that SVG icon is rendered
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('handles invalid dates gracefully', () => {
    const { container } = render(
      <ProjectDuration startDate="invalid-date" endDate="also-invalid" />,
    );
    // Component should still render without crashing
    expect(container).toBeInTheDocument();
  });

  it('renders the complete structure with dates and duration', () => {
    const { container } = render(
      <ProjectDuration startDate="2023-01-15" endDate="2024-06-15" />,
    );
    // Should contain the separator bullet
    expect(container).toHaveTextContent('•');
    // Should have formatted dates
    expect(container).toHaveTextContent('Jan 2023');
    expect(container).toHaveTextContent('Jun 2024');
    // Should have duration in parentheses
    expect(container).toHaveTextContent(/\(/);
    expect(container).toHaveTextContent(/\)/);
  });
});

