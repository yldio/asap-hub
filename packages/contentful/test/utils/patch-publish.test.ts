import { Entry } from 'contentful-management';
import { patchAndPublish } from '../../src/utils';

describe('patchAndPublish', () => {
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
    await patchAndPublish(entry, { foo: 'bar', baz: 1 });
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
    await patchAndPublish(entry, { foo: 'bar', baz: 1 });
    expect(entry.patch).toHaveBeenCalledWith([
      { op: 'replace', path: '/fields/foo', value: { 'en-US': 'bar' } },
      { op: 'add', path: '/fields/baz', value: { 'en-US': 1 } },
    ]);
  });

  test('calls publish on the return value of the patch function', async () => {
    const { entry, publish } = getMocks();
    await patchAndPublish(entry, { foo: 'bar' });
    expect(publish).toHaveBeenCalled();
  });
});
