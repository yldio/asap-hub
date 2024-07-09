import { route, string } from 'react-router-typesafe-routes/dom';

// const calendar = route('/calendar', {}, {});
// const upcoming = route('/upcoming', {}, {});
// const past = route('/past', {}, {});

// const event = route('/:eventId', { eventId: stringParser }, {});

// const events = route('/events', {}, { event, calendar, upcoming, past });

// export default events;

const calendar = route('calendar');
const upcoming = route('upcoming');
const past = route('past');

export const eventRoutes = {
  DEFAULT: route(
    'events/*',
    {},
    {
      CALENDAR: calendar,
      UPCOMING: upcoming,
      PAST: past,
      DETAILS: route(':eventId', {
        params: { eventId: string().defined() },
      }),
    },
  ),
};
