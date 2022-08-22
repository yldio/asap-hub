import { route } from 'typesafe-routes';

const dismissGettingStarted = route('dismiss-getting-started', {}, {});

export default route('/', {}, { dismissGettingStarted });
