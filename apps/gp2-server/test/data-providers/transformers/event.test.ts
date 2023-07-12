import {
  getContentfulEventMaterial,
  getMeetingMaterial,
} from '../../../src/data-providers/transformers/event';

describe('events entity', () => {
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
});
