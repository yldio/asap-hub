import { parseGraphQlWorkingGroup } from '../../src/entities';
import {
  getWorkingGroupDataObject,
  getWorkingGroupSquidexGraphql,
} from '../fixtures/working-group.fixtures';

describe('parse GraphQL Working Group entities', () => {
  test('Should parse the Working Group', () => {
    expect(parseGraphQlWorkingGroup(getWorkingGroupSquidexGraphql())).toEqual(
      getWorkingGroupDataObject(),
    );
  });

  test.each(['title', 'description'])(
    'Should default %s to an empty string',
    async (property) => {
      const workingGroupSquidexGraphql = getWorkingGroupSquidexGraphql();
      workingGroupSquidexGraphql.flatData[property as 'title' | 'description'] =
        null;

      const workingGroupDataObject = parseGraphQlWorkingGroup(
        workingGroupSquidexGraphql,
      );

      expect(workingGroupDataObject[property as 'title' | 'description']).toBe(
        '',
      );
    },
  );

  test('Should not return the external-link if the external-link-text is missing', () => {
    const workingGroupSquidexGraphql = getWorkingGroupSquidexGraphql();
    workingGroupSquidexGraphql.flatData.externalLinkText = null;

    const workingGroupDataObject = parseGraphQlWorkingGroup(
      workingGroupSquidexGraphql,
    );

    const expectedWorkingGroupDataObject = getWorkingGroupDataObject();
    delete (expectedWorkingGroupDataObject as any).externalLink;
    delete (expectedWorkingGroupDataObject as any).externalLinkText;

    expect(workingGroupDataObject).toStrictEqual(
      expectedWorkingGroupDataObject,
    );
  });

  test('Should not return the external-link-text if the external-link is missing', () => {
    const workingGroupSquidexGraphql = getWorkingGroupSquidexGraphql();
    workingGroupSquidexGraphql.flatData.externalLink = null;

    const workingGroupDataObject = parseGraphQlWorkingGroup(
      workingGroupSquidexGraphql,
    );

    const expectedWorkingGroupDataObject = getWorkingGroupDataObject();
    delete (expectedWorkingGroupDataObject as any).externalLink;
    delete (expectedWorkingGroupDataObject as any).externalLinkText;

    expect(workingGroupDataObject).toStrictEqual(
      expectedWorkingGroupDataObject,
    );
  });
});
