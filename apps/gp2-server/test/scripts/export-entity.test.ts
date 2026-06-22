import { transformRecords } from '../../scripts/export-entity';
import { getUserResponse } from '../fixtures/user.fixtures';

describe('transformRecords', () => {
  it('derives membershipStatus="Alumni Member" when alumniSinceDate is set', () => {
    const user = { ...getUserResponse(), alumniSinceDate: '2024-01-01' };

    const result = transformRecords(user, 'user');

    expect(result).toMatchObject({
      objectID: user.id,
      __meta: { type: 'user' },
      membershipStatus: 'Alumni Member',
    });
  });

  it('derives membershipStatus="GP2 Member" when alumniSinceDate is absent', () => {
    const user = { ...getUserResponse(), alumniSinceDate: undefined };

    const result = transformRecords(user, 'user');

    expect(result).toMatchObject({
      objectID: user.id,
      __meta: { type: 'user' },
      membershipStatus: 'GP2 Member',
    });
  });

  it('flattens tags into _tags for tagged entities', () => {
    const user = {
      ...getUserResponse(),
      tags: [
        { id: 't1', name: 'tag-one' },
        { id: 't2', name: 'tag-two' },
      ],
    };

    const result = transformRecords(user, 'user');

    expect(result).toMatchObject({ _tags: ['tag-one', 'tag-two'] });
  });
});
