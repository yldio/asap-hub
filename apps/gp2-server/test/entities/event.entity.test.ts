import { gp2 } from '@asap-hub/model';
import {
  getMeetingMaterial,
  parseEventSpeakerUser,
  parseGraphQLEvent,
  parseGraphQLSpeakers,
} from '../../src/entities/event.entity';
import {
  getEventSpeaker,
  getSquidexGraphqlEvent,
  getSquidexGraphqlEventSpeakerWithUser,
} from '../fixtures/event.fixtures';

describe('events entity', () => {
  const graphqlEvent = getSquidexGraphqlEvent();
  describe('parseGraphQLEvent', () => {
    test(`throws when provided event doesn't have a calendar`, () => {
      const event = {
        ...graphqlEvent,
        id: 'example',
        flatData: {
          ...graphqlEvent.flatData,
          calendar: [],
        },
      };
      expect(() => parseGraphQLEvent(event)).toThrowError(
        `Event (example) doesn't have a calendar`,
      );
    });
    test('throws when provided an invalid event status', () => {
      const event = {
        ...graphqlEvent,
        id: 'example',
        flatData: {
          ...graphqlEvent.flatData,
          status: 'invalid',
        },
      };
      expect(() => parseGraphQLEvent(event)).toThrowErrorMatchingInlineSnapshot(
        `"Invalid event (example) status "invalid""`,
      );
    });
    test('ignores empty thumbnail', () => {
      const event = {
        ...graphqlEvent,
        id: 'example',
        flatData: {
          ...graphqlEvent.flatData,
          thumbnail: [],
        },
      };
      const { thumbnail } = parseGraphQLEvent(event);
      expect(thumbnail).toEqual(undefined);
    });
  });
  describe('getMeetingMaterial', () => {
    test.each([null, undefined, [], 'detail', ['item']])(
      'always returns null when meeting material "%s" specified unavailable',
      (material) => {
        expect(getMeetingMaterial(material, true, false, [])).toBeNull();
        expect(getMeetingMaterial(material, true, true, [])).toBeNull();
      },
    );

    test.each([null, undefined, []])(
      'returns null when stale and meeting material is missing "%s"',
      (material) =>
        expect(getMeetingMaterial(material, false, true, [])).toBeNull(),
    );

    test.each`
      material     | empty
      ${null}      | ${undefined}
      ${undefined} | ${null}
      ${[]}        | ${undefined}
    `(
      'returns empty value "$empty" when fresh and missing material is "$material"',
      ({ material, empty }) =>
        expect(getMeetingMaterial(material, false, false, empty)).toEqual(
          empty,
        ),
    );
    test.each(['string', ['a']])(
      'always returns material "%s" when not permanently unavailable',
      (material) => {
        expect(getMeetingMaterial(material, false, false, undefined)).toEqual(
          material,
        );
        expect(getMeetingMaterial(material, false, true, undefined)).toEqual(
          material,
        );
      },
    );
  });

  describe('Speakers', () => {
    test('Should return the user', () => {
      const eventSpeakers = parseGraphQLSpeakers([
        getSquidexGraphqlEventSpeakerWithUser(),
      ]);

      expect(eventSpeakers[0]!).toBeDefined();

      const expectedEventSpeakers: gp2.EventSpeaker = getEventSpeaker();
      expect(eventSpeakers).toStrictEqual([expectedEventSpeakers]);
    });

    test('parse event speaker properly maps speaker', () => {
      const eventSpeaker = parseEventSpeakerUser({
        __typename: 'Users',
        id: 'user-id-3',
        flatData: {
          avatar: [
            {
              id: 'avatar-id',
            },
          ],
          firstName: 'Adam',
          lastName: 'Brown',
          onboarded: true,
        },
      });

      expect(eventSpeaker?.displayName).toEqual('Adam Brown');
      expect(eventSpeaker?.avatarUrl).toContain('/avatar-id');
    });
  });
  test('Should skip the user if not onboarded', () => {
    const eventSpeakers = parseGraphQLSpeakers([
      getSquidexGraphqlEventSpeakerWithUser({ onboarded: false }),
    ]);

    expect(eventSpeakers).toStrictEqual([]);
  });
});
