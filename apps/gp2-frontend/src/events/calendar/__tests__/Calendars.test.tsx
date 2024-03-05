import { gp2 } from '@asap-hub/fixtures';
import {
  render,
  waitForElementToBeRemoved,
  screen,
  within,
} from '@testing-library/react';
import { Suspense } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import { Auth0Provider, WhenReady } from '../../../auth/test-utils';
import { getCalendars } from '../api';
import Calendars from '../Calendars';

jest.mock('../api');

const renderCalendars = async () => {
  render(
    <RecoilRoot>
      <Suspense fallback="loading">
        <Auth0Provider user={{}}>
          <WhenReady>
            <MemoryRouter initialEntries={['/events/calendar']}>
              <Calendars />
            </MemoryRouter>
          </WhenReady>
        </Auth0Provider>
      </Suspense>
    </RecoilRoot>,
  );
  return waitForElementToBeRemoved(() => screen.queryByText(/loading/i));
};
describe('Calendars', () => {
  beforeEach(jest.resetAllMocks);

  it('renders calendar', async () => {
    const mockGetCalendars = getCalendars as jest.MockedFunction<
      typeof getCalendars
    >;
    mockGetCalendars.mockResolvedValue(gp2.createListCalendarResponse());
    await renderCalendars();
    expect(screen.getByTitle('Calendar')).toBeVisible();
  });
  it('renders a calendar in the projects section when the calendar has a project', async () => {
    const mockGetCalendars = getCalendars as jest.MockedFunction<
      typeof getCalendars
    >;
    const listCalendars = gp2.createListCalendarResponse(1, {
      name: 'calendar title',
      projects: [{ id: '42', title: 'a', status: 'Active' }],
      workingGroups: [],
    });
    mockGetCalendars.mockResolvedValue(listCalendars);
    await renderCalendars();
    const projectSection = screen.getByRole('heading', {
      name: /Subscribe to Projects Calendar/i,
    }).parentElement?.parentElement as HTMLElement;
    const workingGroupSection = screen.getByRole('heading', {
      name: /Subscribe to Working Groups Calendar/i,
    }).parentElement?.parentElement as HTMLElement;
    expect(within(projectSection).getByText(/calendar title/)).toBeVisible();
    expect(
      within(workingGroupSection).queryByText(/calendar title/),
    ).not.toBeInTheDocument();
  });
  it('renders a calendar in the working group section when the calendar has a working group', async () => {
    const mockGetCalendars = getCalendars as jest.MockedFunction<
      typeof getCalendars
    >;
    const listCalendars = gp2.createListCalendarResponse(1, {
      name: 'calendar title',
      projects: [],
      workingGroups: [{ id: '42', title: 'a' }],
    });
    mockGetCalendars.mockResolvedValue(listCalendars);
    await renderCalendars();
    const projectSection = screen.getByRole('heading', {
      name: /Subscribe to Projects Calendar/i,
    }).parentElement?.parentElement as HTMLElement;
    const workingGroupSection = screen.getByRole('heading', {
      name: /Subscribe to Working Groups Calendar/i,
    }).parentElement?.parentElement as HTMLElement;
    expect(
      within(workingGroupSection).getByText(/calendar title/),
    ).toBeVisible();
    expect(
      within(projectSection).queryByText(/calendar title/),
    ).not.toBeInTheDocument();
  });
  it('renders a calendar in the working group section when the calendar does not have a project or a working group', async () => {
    const mockGetCalendars = getCalendars as jest.MockedFunction<
      typeof getCalendars
    >;
    const listCalendars = gp2.createListCalendarResponse(1, {
      name: 'calendar title',
      projects: [],
      workingGroups: [],
    });
    mockGetCalendars.mockResolvedValue(listCalendars);
    await renderCalendars();
    const projectSection = screen.getByRole('heading', {
      name: /Subscribe to Projects Calendar/i,
    }).parentElement?.parentElement as HTMLElement;
    const workingGroupSection = screen.getByRole('heading', {
      name: /Subscribe to Working Groups Calendar/i,
    }).parentElement?.parentElement as HTMLElement;
    expect(
      within(workingGroupSection).getByText(/calendar title/),
    ).toBeVisible();
    expect(
      within(projectSection).queryByText(/calendar title/),
    ).not.toBeInTheDocument();
  });
  it('renders a calendar in the both sections when the calendar has a working group and a project', async () => {
    const mockGetCalendars = getCalendars as jest.MockedFunction<
      typeof getCalendars
    >;
    const listCalendars = gp2.createListCalendarResponse(1, {
      name: 'calendar title',
      projects: [{ id: '42', title: 'a', status: 'Active' }],
      workingGroups: [{ id: '42', title: 'a' }],
    });
    mockGetCalendars.mockResolvedValue(listCalendars);
    await renderCalendars();
    const projectSection = screen.getByRole('heading', {
      name: /Subscribe to Projects Calendar/i,
    }).parentElement?.parentElement as HTMLElement;
    const workingGroupSection = screen.getByRole('heading', {
      name: /Subscribe to Working Groups Calendar/i,
    }).parentElement?.parentElement as HTMLElement;
    expect(
      within(workingGroupSection).getByText(/calendar title/),
    ).toBeVisible();
    expect(within(projectSection).queryByText(/calendar title/)).toBeVisible();
  });
  it('renders calendar from not completed projects', async () => {
    const mockGetCalendars = getCalendars as jest.MockedFunction<
      typeof getCalendars
    >;
    const calendarFromActiveProject = gp2.createCalendarResponse(1, {
      name: 'calendar active project',
      projects: [{ id: '1', title: 'Calendar 1', status: 'Active' }],
      workingGroups: [{ id: '42', title: 'a' }],
    });
    const calendarFromCompletedProject = gp2.createCalendarResponse(1, {
      name: 'calendar completed project',
      projects: [{ id: '2', title: 'Calendar 2', status: 'Completed' }],
      workingGroups: [],
    });
    mockGetCalendars.mockResolvedValue({
      total: 2,
      items: [calendarFromActiveProject, calendarFromCompletedProject],
    });
    await renderCalendars();
    const projectSection = screen.getByRole('heading', {
      name: /Subscribe to Projects Calendar/i,
    }).parentElement?.parentElement as HTMLElement;
    expect(
      within(projectSection).queryByText(/calendar active project/),
    ).toBeVisible();
    expect(
      within(projectSection).queryByText(/calendar completed project/),
    ).not.toBeInTheDocument();
  });
});
