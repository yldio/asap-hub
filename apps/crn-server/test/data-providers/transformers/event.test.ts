import {
  EventSpeakerExternalUser,
  EventSpeakerTeam,
  EventSpeakerUser,
} from '@asap-hub/model';
import {
  GraphqlEventSpeakerUser,
  getMeetingMaterial,
  parseEventSpeakerUser,
  parseGraphQLEvent,
  parseGraphQLSpeakers,
  getContentfulEventMaterial,
} from '../../../src/data-providers/transformers';
import {
  getEventSpeakerUser,
  getSquidexGraphqlEvent,
  getSquidexGraphqlEventSpeakerWithExternalUser,
  getSquidexGraphqlEventSpeakerWithUser,
} from '../../fixtures/events.fixtures';
import { getWorkingGroupDataObject } from '../../fixtures/working-groups.fixtures';

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
    test('remove the speaker from speakers list when it does not have the team assigned', () => {
      const squidexSpeaker1 = getSquidexGraphqlEventSpeakerWithUser();
      squidexSpeaker1.team = [];
      squidexSpeaker1.user![0]!.id = 'user-without-team';

      const squidexSpeaker2 = getSquidexGraphqlEventSpeakerWithUser();
      squidexSpeaker2.user![0]!.id = 'user-with-team';

      const event = {
        ...graphqlEvent,
        flatData: {
          ...graphqlEvent.flatData,
          speakers: [squidexSpeaker1, squidexSpeaker2],
        },
      };

      const parsedEvent = parseGraphQLEvent(event);

      const expectedEventSpeakers = getEventSpeakerUser();
      expectedEventSpeakers.user.id = 'user-with-team';

      expect(parsedEvent.speakers).toEqual([expectedEventSpeakers]);
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

  describe('getContentfulEventMaterial', () => {
    const additionalMaterials = [
      {
        title: 'Drive folder',
        url: 'https://www.google.drive.com/id',
      },
    ];

    const richTextMaterial = {
      json: {
        data: {},
        content: [
          {
            data: {},
            content: [
              {
                data: {},
                marks: [],
                value: 'notes',
                nodeType: 'text',
              },
            ],
            nodeType: 'paragraph',
          },
        ],
        nodeType: 'document',
      },
      links: {
        entries: {
          inline: [],
        },
        assets: {
          block: [],
        },
      },
    };

    test.each`
      material               | isStale
      ${additionalMaterials} | ${false}
      ${additionalMaterials} | ${true}
      ${richTextMaterial}    | ${false}
      ${richTextMaterial}    | ${true}
    `(
      'returns null when meeting material is permanently unavailable',
      ({ material, isStale }) => {
        const isPermanentlyUnavailable = true;

        expect(
          getContentfulEventMaterial(
            material,
            isPermanentlyUnavailable,
            isStale,
            [],
          ),
        ).toBeNull();
        expect(
          getContentfulEventMaterial(
            material,
            isPermanentlyUnavailable,
            isStale,
            [],
          ),
        ).toBeNull();
      },
    );

    test.each([[], null])(
      'returns null when stale and meeting material is missing "%s"',
      (material) => {
        const isPermanentlyUnavailable = false;
        const isStale = true;
        expect(
          getContentfulEventMaterial(
            material,
            isPermanentlyUnavailable,
            isStale,
            [],
          ),
        ).toBeNull();
      },
    );

    test.each`
      material     | empty
      ${null}      | ${undefined}
      ${undefined} | ${null}
      ${[]}        | ${undefined}
    `(
      'returns empty value "$empty" when fresh and missing material is "$material"',
      ({ material, empty }) =>
        expect(
          getContentfulEventMaterial(material, false, false, empty),
        ).toEqual(empty),
    );

    test.each`
      material               | isStale  | result
      ${additionalMaterials} | ${false} | ${additionalMaterials}
      ${additionalMaterials} | ${true}  | ${additionalMaterials}
      ${richTextMaterial}    | ${false} | ${'<p>notes</p>'}
      ${richTextMaterial}    | ${true}  | ${'<p>notes</p>'}
    `(
      'returns material when not permanently unavailable',
      ({ material, isStale, result }) => {
        const isPermanentlyUnavailable = false;
        expect(
          getContentfulEventMaterial(
            material,
            isPermanentlyUnavailable,
            isStale,
            undefined,
          ),
        ).toEqual(result);
      },
    );
  });

  describe('Speakers', () => {
    test('Should return the user, the team and their role in that team', () => {
      const eventSpeakers = parseGraphQLSpeakers([
        getSquidexGraphqlEventSpeakerWithUser(),
      ]) as [EventSpeakerUser];

      expect(eventSpeakers[0]!.user).toBeDefined();
      expect(eventSpeakers[0]!.role).toBeDefined();

      const expectedEventSpeakers: EventSpeakerUser = getEventSpeakerUser();
      expect(eventSpeakers).toStrictEqual([expectedEventSpeakers]);
    });

    test('Should return the team only when there is no user in squidex response', () => {
      const squidexSpeaker = getSquidexGraphqlEventSpeakerWithUser();
      squidexSpeaker.user = [];

      const expectedEventSpeakers: EventSpeakerTeam = {
        team: getEventSpeakerUser().team,
      };
      expect(parseGraphQLSpeakers([squidexSpeaker])).toStrictEqual([
        expectedEventSpeakers,
      ]);
    });

    test('Should return the team only when the user is not part of the selected team', () => {
      const squidexSpeaker = getSquidexGraphqlEventSpeakerWithUser();
      (
        squidexSpeaker.user![0]!.flatData as GraphqlEventSpeakerUser['flatData']
      ).teams![0]!.id![0]!.id = 'the-other-team-id';

      const eventSpeaker = getEventSpeakerUser();
      eventSpeaker.team.id = 'the-team-id';

      const expectedEventSpeakers: EventSpeakerTeam = {
        team: getEventSpeakerUser().team,
      };
      expect(parseGraphQLSpeakers([squidexSpeaker])).toStrictEqual([
        expectedEventSpeakers,
      ]);
    });

    test('Should return the team only when the user is not onboarded', () => {
      const squidexSpeaker = getSquidexGraphqlEventSpeakerWithUser();
      (
        squidexSpeaker.user![0]!.flatData as GraphqlEventSpeakerUser['flatData']
      ).onboarded = false;

      const eventSpeaker = getEventSpeakerUser();
      eventSpeaker.team.id = 'the-team-id';

      const expectedEventSpeakers: EventSpeakerTeam = {
        team: getEventSpeakerUser().team,
      };
      expect(parseGraphQLSpeakers([squidexSpeaker])).toStrictEqual([
        expectedEventSpeakers,
      ]);
    });

    test('Should return the external user', () => {
      const squidexSpeaker = getSquidexGraphqlEventSpeakerWithExternalUser();

      const expectedSpeakers: EventSpeakerExternalUser[] = [
        {
          externalUser: {
            name: 'Adam Brown',
            orcid: 'https://orcid.org/0000-0002-1825-0097',
          },
        },
      ];
      expect(parseGraphQLSpeakers([squidexSpeaker])).toEqual(expectedSpeakers);
    });

    test('parse event speaker properly maps speaker', () => {
      const eventSpeaker = parseEventSpeakerUser({
        __typename: 'Users',
        id: 'user-id-3',
        flatData: {
          alumniSinceDate: undefined,
          alumniLocation: 'Cambridge, UK',
          avatar: [
            {
              id: 'avatar-id',
            },
          ],
          firstName: 'Adam',
          lastName: 'Brown',
          onboarded: true,
          teams: [
            {
              id: [
                {
                  id: 'team-id-3',
                },
              ],
              role: 'Lead PI (Core Leadership)',
            },
          ],
        },
      });

      expect(eventSpeaker?.displayName).toEqual('Adam Brown');
      expect(eventSpeaker?.avatarUrl).toContain('/avatar-id');
    });
  });

  describe('Working Group', () => {
    it('returns undefined when referencingWorkingGroupsContents is null', () => {
      const event = {
        ...graphqlEvent,
        flatData: {
          ...graphqlEvent.flatData,
          calendar: [
            {
              ...graphqlEvent.flatData.calendar![0]!,
              referencingWorkingGroupsContents: null,
            },
          ],
        },
      };
      const parsedEvent = parseGraphQLEvent(event);
      expect(parsedEvent.workingGroup).toEqual(undefined);
    });

    it('returns working group object when referencingWorkingGroupsContents is not null', () => {
      const parsedEvent = parseGraphQLEvent(graphqlEvent);
      expect(parsedEvent.workingGroup).toEqual(getWorkingGroupDataObject());
    });
  });
});
