import { createEventResponse } from '@asap-hub/fixtures';
import { eventMapper } from '../event-mapper';

describe('eventMapper', () => {
  it('maps tags[] to string[]', () => {
    const event = createEventResponse();
    expect(
      eventMapper({
        ...event,
        tags: [
          { id: '1', name: 'Blood' },
          { id: '2', name: 'Bacteria' },
        ],
      }).tags,
    ).toEqual(['Blood', 'Bacteria']);
  });
});
