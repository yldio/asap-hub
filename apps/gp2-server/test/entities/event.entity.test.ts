import { gp2 } from '@asap-hub/model';
import {
  getContentfulEventMaterial,
  getMeetingMaterial,
  parseContentfulWorkingGroupProject,
  parseEventSpeakerExternalUser,
  parseEventSpeakerUser,
  parseGraphQLEvent,
  parseGraphQLSpeakers,
  parseGraphQLWorkingGroupProjects,
} from '../../src/entities/event.entity';
import {
  getEventExternalSpeaker,
  getEventSpeaker,
  getEventSpeakerToBeAnnounced,
  getSquidexGraphqlEvent,
  getSquidexGraphqlEventSpeakerWithExternalUser,
  getSquidexGraphqlEventSpeakerWithUser,
} from '../fixtures/event.fixtures';
import { getGraphQLProject } from '../fixtures/project.fixtures';
import { getGraphQLWorkingGroup } from '../fixtures/working-group.fixtures';

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

  describe('Working Groups and Projects', () => {
    const calendar = {
      linkedFrom: {
        workingGroupsCollection: {
          items: [
            {
              sys: {
                id: 'working-group-id-1',
              },
              title: 'Some title',
            },
          ],
        },
        projectsCollection: {
          items: [
            {
              sys: {
                id: 'project-id-1',
              },
              title: 'Another title',
            },
          ],
        },
      },
    };

    test('Should parse working group and project', () => {
      const { workingGroup, project } = parseContentfulWorkingGroupProject(calendar);

      expect(workingGroup).toEqual({
        id: 'working-group-id-1',
        title: 'Some title',
      });
      expect(project).toEqual({
        id: 'project-id-1',
        title: 'Another title',
      });
    });

    test('Should return undefined working group and project when calendar is undefined', () => {
      const { workingGroup, project } =
        parseContentfulWorkingGroupProject(undefined);

      expect(workingGroup).toBeUndefined();
      expect(project).toBeUndefined();
    });
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

    test('parse event speaker properly maps internal speaker', () => {
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

    test('parse event speaker properly maps external speaker', () => {
      const eventSpeaker = parseEventSpeakerExternalUser({
        __typename: 'ExternalUsers',
        id: 'user-id-3',
        flatData: {
          name: 'Adam Brown',
          orcid: '1234-1234-1234',
        },
      });

      expect(eventSpeaker?.name).toEqual('Adam Brown');
      expect(eventSpeaker?.orcid).toEqual('1234-1234-1234');
    });

    test('parse event speaker properly maps speaker to be announced', () => {
      const eventSpeakers = parseGraphQLSpeakers([{ user: null, topic: null }]);

      expect(eventSpeakers.length).toBe(1);
      expect(eventSpeakers[0]?.speaker).toBeUndefined();
      expect(eventSpeakers[0]?.topic).toBeUndefined();
    });
  });

  test('should return different types of speakers', () => {
    const eventSpeakers = parseGraphQLSpeakers([
      getSquidexGraphqlEventSpeakerWithUser(),
      getSquidexGraphqlEventSpeakerWithExternalUser(),
      { user: null, topic: null },
    ]);

    expect(eventSpeakers).toStrictEqual([
      getEventSpeaker(),
      getEventExternalSpeaker(),
      getEventSpeakerToBeAnnounced(),
    ]);
  });

  test('Should skip the user if not onboarded', () => {
    const eventSpeakers = parseGraphQLSpeakers([
      getSquidexGraphqlEventSpeakerWithUser({ onboarded: false }),
    ]);

    expect(eventSpeakers).toStrictEqual([]);
  });

  describe('parseGraphQLWorkingGroupProjects', () => {
    it('parses the working groups', () => {
      const id = '42';
      const title = 'some title';
      const workingGroupData = getGraphQLWorkingGroup();
      workingGroupData.id = id;
      workingGroupData.flatData.title = title;
      const { workingGroup, project } = parseGraphQLWorkingGroupProjects({
        referencingWorkingGroupsContents: [workingGroupData],
        referencingProjectsContents: [],
      });
      expect(workingGroup).toEqual({ id, title });
      expect(project).toBeUndefined();
    });

    it('parses the project', () => {
      const id = '42';
      const title = 'some title';
      const projectData = getGraphQLProject();
      projectData.id = id;
      projectData.flatData.title = title;
      const { workingGroup, project } = parseGraphQLWorkingGroupProjects({
        referencingWorkingGroupsContents: [],
        referencingProjectsContents: [projectData],
      });
      expect(project).toEqual({ id, title });
      expect(workingGroup).toBeUndefined();
    });
  });
});
