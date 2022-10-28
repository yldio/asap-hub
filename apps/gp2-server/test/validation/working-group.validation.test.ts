import { gp2 } from '@asap-hub/model';
import { validateWorkingGroupPatchRequest } from '../../src/validation/working-group.validation';

describe('Working Group validation', () => {
  const getLink = (): gp2.ResourceLink => ({
    type: 'Link' as const,
    title: 'a title',
    description: 'some description',
    externalLink: 'http://example.com',
  });
  const getNote = (): gp2.ResourceNote => ({
    type: 'Note',
    title: 'a title',
    description: 'some description',
  });
  const toResources = (resource: gp2.Resource): Record<string, unknown> =>
    [resource] as unknown as Record<string, unknown>;
  describe.each`
    type      | getFixture
    ${'Note'} | ${getNote}
    ${'Link'} | ${getLink}
  `('Resource of $type', ({ getFixture }) => {
    test('validates', () => {
      const resource = getFixture();
      expect(() =>
        validateWorkingGroupPatchRequest(toResources(resource)),
      ).not.toThrow();
    });
    test('description is optional', () => {
      const resource = getFixture();
      resource.description = undefined;

      expect(() =>
        validateWorkingGroupPatchRequest(toResources(resource)),
      ).not.toThrow();
    });
    test('title is required', () => {
      const resource = getFixture();
      resource.title = undefined;

      expect(() =>
        validateWorkingGroupPatchRequest(toResources(resource)),
      ).toThrow();
    });
  });

  test('externalLink is required on Link', () => {
    const resource = getLink();

    // @ts-ignore
    resource.externalLink = undefined;

    expect(() =>
      validateWorkingGroupPatchRequest(toResources(resource)),
    ).toThrow();
  });

  test('externalLink is a valid url on Link', () => {
    const resource = getLink();

    resource.externalLink = 'some-string';
    expect(() =>
      validateWorkingGroupPatchRequest(toResources(resource)),
    ).toThrow();
  });
  test('externalLink is not allowed on a Note', () => {
    const resource = getNote();

    // @ts-ignore
    resource.externalLink = 'http://example.com';
    expect(() =>
      validateWorkingGroupPatchRequest(toResources(resource)),
    ).toThrow();
  });
  test.each(['invalid-type', 'Note2'])(
    'should not allow random types %s',
    (type) => {
      const resource = getNote();
      // @ts-ignore
      resource.type = type;

      expect(() =>
        validateWorkingGroupPatchRequest(toResources(resource)),
      ).toThrow();
    },
  );
  test('should not allow random types Link2', () => {
    const resource = getLink();
    // @ts-ignore
    resource.type = 'Link2';

    expect(() =>
      validateWorkingGroupPatchRequest(toResources(resource)),
    ).toThrow();
  });
  test('should allow an empty array', () => {
    expect(() =>
      validateWorkingGroupPatchRequest(
        [] as unknown as Record<string, unknown>,
      ),
    ).not.toThrow();
  });
  test('should throw when undefined', () => {
    // @ts-ignore
    expect(() => validateWorkingGroupPatchRequest(undefined)).toThrow();
  });
});
