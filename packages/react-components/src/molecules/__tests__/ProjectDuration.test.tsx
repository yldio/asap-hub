import { render } from '@testing-library/react';
import ProjectDuration, { calculateDuration } from '../ProjectDuration';

describe('calculateDuration', () => {
  it('returns months when less than 12 months', () => {
    expect(calculateDuration('2023-01-15', '2023-06-15')).toBe('5 mos');
    expect(calculateDuration('2023-01-15', '2023-11-15')).toBe('10 mos');
  });

  it('returns "1 yr" for exactly 12 months', () => {
    expect(calculateDuration('2023-01-15', '2024-01-15')).toBe('1 yr');
  });

  it('returns "yrs" (plural) for more than 12 months', () => {
    expect(calculateDuration('2023-01-15', '2025-01-15')).toBe('2 yrs');
    expect(calculateDuration('2020-01-15', '2025-01-15')).toBe('5 yrs');
  });

  it('returns "Invalid Period" for invalid start date', () => {
    expect(calculateDuration('invalid-date', '2024-01-15')).toBe(
      'Invalid Period',
    );
  });

  it('returns "Invalid Period" for invalid end date', () => {
    expect(calculateDuration('2023-01-15', 'invalid-date')).toBe(
      'Invalid Period',
    );
  });

  it('returns "Invalid Period" for both invalid dates', () => {
    expect(calculateDuration('invalid', 'also-invalid')).toBe('Invalid Period');
  });

  it('returns "Invalid Period" for empty strings', () => {
    expect(calculateDuration('', '')).toBe('Invalid Period');
  });

  it('handles edge case of 0 months', () => {
    expect(calculateDuration('2023-01-15', '2023-01-20')).toBe('0 mos');
  });
});

describe('ProjectDuration', () => {
  it('renders start and end dates', () => {
    const { getByText } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate="2025-12-31"
        projectStatus="Completed"
      />,
    );
    expect(getByText(/Jan 2023/)).toBeVisible();
    expect(getByText(/Dec 2025/)).toBeVisible();
  });

  it('displays duration in months when less than 12 months', () => {
    const { getByText } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate="2023-06-15"
        projectStatus="Completed"
      />,
    );
    expect(getByText(/5 mos/)).toBeVisible();
  });

  it('displays duration in months as "mos" abbreviation', () => {
    const { getByText } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate="2023-11-15"
        projectStatus="Closed"
      />,
    );
    expect(getByText(/10 mos/)).toBeVisible();
  });

  it('displays duration as "1 yr" (singular) for exactly 12 months', () => {
    const { getByText } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate="2024-01-15"
        projectStatus="Closed"
      />,
    );
    expect(getByText(/1 yr/)).toBeVisible();
    expect(getByText(/1 yr/)).not.toHaveTextContent('yrs');
  });

  it('displays duration as "yrs" (plural) for more than 12 months', () => {
    const { getByText } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate="2025-12-31"
        projectStatus="Completed"
      />,
    );
    // Jan 2023 to Dec 2025 is approximately 35-36 months = 2-3 years
    expect(getByText(/[23] yrs/)).toBeVisible();
  });

  it('displays duration for a 2-year project', () => {
    const { getByText } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate="2025-01-15"
        projectStatus="Completed"
      />,
    );
    expect(getByText(/2 yrs/)).toBeVisible();
  });

  it('displays duration for a 5-year project', () => {
    const { getByText } = render(
      <ProjectDuration
        startDate="2020-01-15"
        endDate="2025-01-15"
        projectStatus="Completed"
      />,
    );
    expect(getByText(/5 yrs/)).toBeVisible();
  });

  it('handles edge case of less than 1 month', () => {
    const { getByText } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate="2023-01-20"
        projectStatus="Completed"
      />,
    );
    expect(getByText(/0 mos/)).toBeVisible();
  });

  it('renders the clock icon', () => {
    const { container } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate="2024-01-15"
        projectStatus="Completed"
      />,
    );
    // Check that SVG icon is rendered
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('handles invalid dates gracefully', () => {
    const { container } = render(
      <ProjectDuration
        startDate="invalid-date"
        endDate="also-invalid"
        projectStatus="Completed"
      />,
    );
    // Component should still render without crashing
    expect(container).toBeInTheDocument();
    expect(container).toHaveTextContent('Invalid Period');
  });

  it('renders the complete structure with dates and duration', () => {
    const { container } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate="2024-06-15"
        projectStatus="Completed"
      />,
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

  it('renders "Present" when endDate is not provided and status is not Active', () => {
    const { getByText, container } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate=""
        projectStatus="Closed"
      />,
    );
    expect(getByText(/Present/)).toBeVisible();
    expect(container).toHaveTextContent('Jan 2023');
  });

  it('does not show duration when endDate is not provided', () => {
    const { container } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate=""
        projectStatus="Closed"
      />,
    );
    // Should NOT contain the separator bullet
    expect(container).not.toHaveTextContent('•');
    // Should NOT have duration in parentheses
    expect(container).not.toHaveTextContent(/\(/);
    expect(container).not.toHaveTextContent(/\)/);
    expect(container).not.toHaveTextContent('mos');
    expect(container).not.toHaveTextContent('yr');
  });

  it('renders "Present" when endDate is not provided and status is Active', () => {
    const { getByText, container } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate=""
        projectStatus="Active"
      />,
    );
    expect(getByText(/Present/)).toBeVisible();
    expect(container).toHaveTextContent('Jan 2023');
  });

  it('renders "Present" when endDate is provided and status is Active', () => {
    const { getByText, container } = render(
      <ProjectDuration
        startDate="2023-01-15"
        endDate="2024-01-15"
        projectStatus="Active"
      />,
    );
    expect(getByText(/Present/)).toBeVisible();
    expect(container).toHaveTextContent('Jan 2023');
    expect(container).toHaveTextContent('Present');
  });
});
