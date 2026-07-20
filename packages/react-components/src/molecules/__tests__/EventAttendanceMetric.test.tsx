import { render } from '@testing-library/react';

import EventAttendanceMetric from '../EventAttendanceMetric';

describe('EventAttendanceMetric', () => {
  it('renders the progress variant with its label, value, caption, wheel and bar', () => {
    const { getByText, getAllByRole } = render(
      <EventAttendanceMetric
        variant="progress"
        label="Attendance"
        value={72}
        caption="18 of 25 teams"
      />,
    );
    expect(getByText('Attendance')).toBeVisible();
    expect(getByText('72%')).toBeVisible();
    expect(getByText('18 of 25 teams')).toBeVisible();
    // one ProgressWheel (desktop) + one ProgressBar (mobile), both in the DOM
    // and toggled by media query — count including the media-hidden wheel.
    expect(getAllByRole('progressbar', { hidden: true })).toHaveLength(2);
  });

  it('renders an increase arrow for an up delta', () => {
    const { getByLabelText, getByText } = render(
      <EventAttendanceMetric
        variant="delta"
        direction="up"
        label="Since last event"
        value={10}
        caption="from 18 of 25 teams"
      />,
    );
    expect(getByText('+ 10')).toBeVisible();
    expect(getByLabelText('Increase')).toBeInTheDocument();
  });

  it('renders a decrease arrow for a down delta', () => {
    const { getByLabelText, getByText } = render(
      <EventAttendanceMetric
        variant="delta"
        direction="down"
        label="Since last event"
        value={5}
        caption="from 12 of 25 teams"
      />,
    );
    expect(getByText('- 5')).toBeVisible();
    expect(getByLabelText('Decrease')).toBeInTheDocument();
  });
});
