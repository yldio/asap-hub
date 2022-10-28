import { gp2 } from '@asap-hub/model';
import { validateWorkingGroupPatchRequest } from '../../src/validation/working-group.validation';

describe('Working Group validation', () => {
  const getLink = (): gp2.Resource => ({
    type: 'Link',
    title: 'a title',
    description: 'some description',
    externalLink: 'http://example.com',
  });
  const getNote = (): gp2.Resource => ({
    type: 'Note',
    title: 'a title',
    description: 'some description',
  });
  describe.each`
    type      | getFixture
    ${'Note'} | ${getNote}
    ${'Link'} | ${getLink}
  `('Resource of $type', ({ getFixture }) => {
    test('validates', () => {
      const resources: gp2.Resource[] = [getFixture()];
      expect(() =>
        validateWorkingGroupPatchRequest(resources as Record<string, any>),
      ).not.toThrow();
    });
    test('description is optional', () => {
      const resource = getFixture();
      resource.description = undefined;

      expect(() =>
        validateWorkingGroupPatchRequest([resource] as Record<string, any>),
      ).not.toThrow();
    });
    test('title is required', () => {
      const resource = getFixture();
      resource.title = undefined;

      expect(() =>
        validateWorkingGroupPatchRequest([resource] as Record<string, any>),
      ).toThrow();
    });
  });
  test('externalLink is required on Link', () => {
    const resource = getLink();

    // @ts-ignore
    resource.externalLink = undefined;
    expect(() =>
      validateWorkingGroupPatchRequest([resource] as Record<string, any>),
    ).toThrow();
  });

  test('externalLink is a valid url on Link', () => {
    const resource = getLink();

    // @ts-ignore
    resource.externalLink = 'some-string';
    expect(() =>
      validateWorkingGroupPatchRequest([resource] as Record<string, any>),
    ).toThrow();
  });
  test('externalLink is not allowed on a Note', () => {
    const resource = getNote();

    // @ts-ignore
    resource.externalLink = 'http://example.com';
    expect(() =>
      validateWorkingGroupPatchRequest([resource] as Record<string, any>),
    ).toThrow();
  });
  test.each(['invalid-type', 'Note2'])(
    'should not allow random types %s',
    (type) => {
      const resource = getNote();
      // @ts-ignore
      resource.type = type;

      expect(() =>
        validateWorkingGroupPatchRequest([resource] as Record<string, any>),
      ).toThrow();
    },
  );
  test('should not allow random types Link2', () => {
    const resource = getLink();
    // @ts-ignore
    resource.type = 'Link2';

    expect(() =>
      validateWorkingGroupPatchRequest([resource] as Record<string, any>),
    ).toThrow();
  });
  test('should allow an empty array', () => {
    expect(() =>
      validateWorkingGroupPatchRequest([] as Record<string, any>),
    ).not.toThrow();
  });
  test('should throw when undefined', () => {
    // @ts-ignore
    expect(() => validateWorkingGroupPatchRequest(undefined)).toThrow();
  });
});
