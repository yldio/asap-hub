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

  it('prefers the interest group thumbnail over the event thumbnail', () => {
    const event = createEventResponse();
    expect(
      eventMapper({
        ...event,
        thumbnail: 'https://example.com/event.png',
        interestGroup: {
          ...event.interestGroup!,
          thumbnail: 'https://example.com/interest-group.png',
        },
      }).thumbnail,
    ).toEqual('https://example.com/interest-group.png');
  });

  it('falls back to the event thumbnail when the interest group has none', () => {
    const event = createEventResponse();
    expect(
      eventMapper({
        ...event,
        thumbnail: 'https://example.com/event.png',
        interestGroup: { ...event.interestGroup!, thumbnail: undefined },
      }).thumbnail,
    ).toEqual('https://example.com/event.png');
  });

  it('leaves the thumbnail undefined when neither has one', () => {
    const event = createEventResponse();
    expect(
      eventMapper({
        ...event,
        thumbnail: undefined,
        interestGroup: { ...event.interestGroup!, thumbnail: undefined },
      }).thumbnail,
    ).toBeUndefined();
  });

  it('falls back to the event thumbnail when there is no interest group', () => {
    const event = createEventResponse();
    expect(
      eventMapper({
        ...event,
        thumbnail: 'https://example.com/event.png',
        interestGroup: undefined,
      }).thumbnail,
    ).toEqual('https://example.com/event.png');
  });

  describe('hasSpeakersToBeAnnounced', () => {
    const team = { id: 't1', displayName: 'Team One' };
    const user = { id: 'u1', displayName: 'User One' };

    it('is true for a team slot without a speaker', () => {
      expect(
        eventMapper({ ...createEventResponse(), speakers: [{ team }] })
          .hasSpeakersToBeAnnounced,
      ).toBe(true);
    });

    it('is false when every speaker is known, including an external guest linked to a team', () => {
      expect(
        eventMapper({
          ...createEventResponse(),
          speakers: [
            { id: 's1', team, user, role: 'Lead PI' },
            { id: 's2', externalUser: { name: 'Guest' }, team },
          ],
        }).hasSpeakersToBeAnnounced,
      ).toBe(false);
    });
  });
});
