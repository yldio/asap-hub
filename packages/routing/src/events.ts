import { route, stringParser } from 'typesafe-routes';

const calendar = route('/calendar', {}, {});
const upcoming = route('/upcoming', {}, {});
const past = route('/past', {}, {});

const event = route('/:eventId', { eventId: stringParser }, {});

const events = route('/events', {}, { event, calendar, upcoming, past });

export default events;
