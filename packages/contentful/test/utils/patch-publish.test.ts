import { Entry } from 'contentful-management';
import {
  patch,
  patchAndPublish,
  patchAndPublishConflict,
} from '../../src/utils';

describe.each`
  name                         | fn
  ${'patchAndPublish'}         | ${patchAndPublish}
  ${'patchAndPublishConflict'} | ${patchAndPublishConflict}
`('$name', ({ fn }) => {
  const returnedEntry = { some: 'entry' };
  const getMocks = () => {
    const publish = jest.fn(() => returnedEntry);
    const entry = {
      fields: {},
      patch: jest.fn().mockResolvedValueOnce({ publish }),
    } as unknown as Entry;
    return { publish, entry };
  };
  test('converts data object passed to a json patch with locales', async () => {
    const { entry } = getMocks();
    await fn(entry, { foo: 'bar', baz: 1 });
    expect(entry.patch).toHaveBeenCalledWith([
      { op: 'add', path: '/fields/foo', value: { 'en-US': 'bar' } },
      { op: 'add', path: '/fields/baz', value: { 'en-US': 1 } },
    ]);
  });

  test('patches with a "replace" op if field exists on entry', async () => {
    const { entry } = getMocks();
    entry.fields = {
      foo: null,
    };
    await fn(entry, { foo: 'bar', baz: 1 });
    expect(entry.patch).toHaveBeenCalledWith([
      { op: 'replace', path: '/fields/foo', value: { 'en-US': 'bar' } },
      { op: 'add', path: '/fields/baz', value: { 'en-US': 1 } },
    ]);
  });

  test('calls publish on the return value of the patch function', async () => {
    const { entry, publish } = getMocks();
    const result = await fn(entry, { foo: 'bar' });
    expect(result).toEqual(returnedEntry);
    expect(publish).toHaveBeenCalled();
  });
});
describe('patchAndPublishConflict', () => {
  test('Conflict should null', async () => {
    const mockPublish = jest.fn();
    const mockPatch = jest
      .fn()
      .mockRejectedValueOnce(new Error(JSON.stringify({ status: 409 })));
    const mockEntry = {
      fields: {},
      patch: mockPatch,
    } as unknown as Entry;
    const result = await patchAndPublishConflict(mockEntry, { foo: 'bar' });
    expect(result).toBeNull();
    expect(mockPublish).not.toHaveBeenCalled();
  });
  test('500 should throw', async () => {
    const mockPatch = jest
      .fn()
      .mockRejectedValueOnce(new Error(JSON.stringify({ status: 500 })));
    const mockEntry = {
      fields: {},
      patch: mockPatch,
    } as unknown as Entry;
    await expect(
      patchAndPublishConflict(mockEntry, { foo: 'bar' }),
    ).rejects.toThrow();
  });
  test('generic error should throw', async () => {
    const mockPatch = jest.fn().mockRejectedValueOnce(new Error());
    const mockEntry = {
      fields: {},
      patch: mockPatch,
    } as unknown as Entry;
    await expect(
      patchAndPublishConflict(mockEntry, { foo: 'bar' }),
    ).rejects.toThrow();
  });
});

describe('patch', () => {
  const getMocks = () => {
    const publish = jest.fn();
    const entry = {
      fields: {},
      patch: jest.fn().mockResolvedValueOnce({ publish }),
    } as unknown as Entry;
    return { publish, entry };
  };
  test('converts data object passed to a json patch with locales', async () => {
    const { entry } = getMocks();
    await patch(entry, { foo: 'bar', baz: 1 });
    expect(entry.patch).toHaveBeenCalledWith([
      { op: 'add', path: '/fields/foo', value: { 'en-US': 'bar' } },
      { op: 'add', path: '/fields/baz', value: { 'en-US': 1 } },
    ]);
  });

  test('patches with a "replace" op if field exists on entry', async () => {
    const { entry } = getMocks();
    entry.fields = {
      foo: null,
    };
    await patch(entry, { foo: 'bar', baz: 1 });
    expect(entry.patch).toHaveBeenCalledWith([
      { op: 'replace', path: '/fields/foo', value: { 'en-US': 'bar' } },
      { op: 'add', path: '/fields/baz', value: { 'en-US': 1 } },
    ]);
  });

  test('does not call publish', async () => {
    const { entry, publish } = getMocks();
    await patch(entry, { foo: 'bar' });
    expect(publish).not.toHaveBeenCalled();
  });
});
