import React from 'react';
import { render, act } from '@testing-library/react';
import { subMinutes, addMinutes, addDays } from 'date-fns';
import { findParentWithStyle } from '@asap-hub/dom-test-utils';

import JoinEvent from '../JoinEvent';
import { silver } from '../../colors';

jest.useFakeTimers('modern');
// TODO
/* eslint-disable jest/no-disabled-tests */

it('renders a link to the meeting', () => {
  const { getByText } = render(
    <JoinEvent
      startDate={subMinutes(new Date(), 1).toISOString()}
      endDate={addMinutes(new Date(), 1).toISOString()}
      meetingLink="https://example.com/meeting"
    />,
  );
  expect(getByText(/join.+meeting/i).closest('a')).toHaveAttribute(
    'href',
    'https://example.com/meeting',
  );
});
it('renders a disabled link if the meeting link is missing', () => {
  const startDate = subMinutes(new Date(), 1).toISOString();
  const endDate = addMinutes(new Date(), 1).toISOString();

  const { getByText, rerender } = render(
    <JoinEvent
      startDate={startDate}
      endDate={endDate}
      meetingLink="https://example.com/meeting"
    />,
  );
  expect(
    findParentWithStyle(getByText(/join.+meeting/i), 'backgroundColor')!
      .backgroundColor,
  ).not.toBe(silver.rgb);

  rerender(
    <JoinEvent
      startDate={startDate}
      endDate={endDate}
      meetingLink={undefined}
    />,
  );
  expect(
    findParentWithStyle(getByText(/join.+meeting/i), 'backgroundColor')!
      .backgroundColor,
  ).toBe(silver.rgb);
});

it('informs you when to expect a link way before the event', () => {
  const { getByText } = render(
    <JoinEvent
      startDate={addDays(new Date(), 1000).toISOString()}
      endDate={addDays(new Date(), 1001).toISOString()}
    />,
  );
  expect(getByText(/link will be available/i)).toBeVisible();
});

it.skip('refreshes when the link should become available', () => {
  const handleRefresh = jest.fn();
  render(
    <JoinEvent
      startDate={addMinutes(new Date(), 10_000).toISOString()}
      endDate={addMinutes(new Date(), 10_100).toISOString()}
      onRefresh={handleRefresh}
    />,
  );

  act(() => {
    jest.advanceTimersByTime(9_999 * 60 * 1000);
  });
  expect(handleRefresh).toHaveBeenCalled();
});
it.skip("warns when the event should be available but isn't", () => {
  const { getByText } = render(
    <JoinEvent
      startDate={addMinutes(new Date(), 10_000).toISOString()}
      endDate={addMinutes(new Date(), 10_100).toISOString()}
    />,
  );

  act(() => {
    jest.advanceTimersByTime(9_999 * 60 * 1000);
  });
  expect(getByText(/couldn't find.+link/i)).toBeVisible();
});
it.skip('does not refresh is there is already a link', () => {
  const handleRefresh = jest.fn();
  render(
    <JoinEvent
      startDate={addMinutes(new Date(), 10_000).toISOString()}
      endDate={addMinutes(new Date(), 10_100).toISOString()}
      onRefresh={handleRefresh}
      meetingLink="https://example.com/meeting"
    />,
  );

  act(() => {
    jest.advanceTimersByTime(9_999 * 60 * 1000);
  });
  expect(handleRefresh).not.toHaveBeenCalled();
});
it.skip('does not refresh way before the event', () => {
  const handleRefresh = jest.fn();
  render(
    <JoinEvent
      startDate={addMinutes(new Date(), 10_000).toISOString()}
      endDate={addMinutes(new Date(), 10_100).toISOString()}
      onRefresh={handleRefresh}
    />,
  );

  act(() => {
    jest.advanceTimersByTime(9_999 * 60 * 1000);
  });
  expect(handleRefresh).not.toHaveBeenCalled();
});

it.skip('informs you when the event has started', () => {
  const { getByText } = render(
    <JoinEvent
      startDate={addMinutes(new Date(), 1).toISOString()}
      endDate={addMinutes(new Date(), 10).toISOString()}
      meetingLink="https://example.com/meeting"
    />,
  );

  act(() => {
    jest.advanceTimersByTime(2 * 60 * 1000);
  });
  expect(getByText(/currently happening/i)).toBeVisible();
});

it.skip('renders nothing after the event has ended', () => {
  const { container } = render(
    <JoinEvent
      startDate={addMinutes(new Date(), 1).toISOString()}
      endDate={addMinutes(new Date(), 10).toISOString()}
      meetingLink="https://example.com/meeting"
    />,
  );

  act(() => {
    jest.advanceTimersByTime(11 * 60 * 1000);
  });
  expect(container).toHaveTextContent('');
});
