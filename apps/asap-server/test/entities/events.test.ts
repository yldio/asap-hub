import {
  getMeetingMaterial,
  parseGraphQLEvent,
} from '../../src/entities/event';
import { getSquidexGraphqlEvent } from '../fixtures/events.fixtures';

describe('events entity', () => {
  const graphqlEvent = getSquidexGraphqlEvent();
  describe('parseGraphQLEvent', () => {
    it(`throws when provided event doesn't have a calendar`, () => {
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
        `"Invalid event (example) status \\"invalid\\""`,
      );
    });
  });
  describe('getMeetingMaterial', () => {
    it.each([null, undefined, [], 'detail', ['item']])(
      'always returns null when meeting material "%s" specified unavailable',
      (material) => {
        expect(getMeetingMaterial(material, true, false, [])).toBeNull();
        expect(getMeetingMaterial(material, true, true, [])).toBeNull();
      },
    );

    it.each([null, undefined, []])(
      'returns null when stale and meeting material is missing "%s"',
      (material) =>
        expect(getMeetingMaterial(material, false, true, [])).toBeNull(),
    );

    it.each`
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
    it.each(['string', ['a']])(
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
});
