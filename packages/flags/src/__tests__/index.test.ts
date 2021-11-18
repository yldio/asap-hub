import { isEnabled, disable, reset, getOverrides } from '..';

const originalNodeEnv = process.env.NODE_ENV;
beforeEach(() => {
  process.env.NODE_ENV = 'unknown';
});
afterEach(() => {
  process.env.NODE_ENV = originalNodeEnv;
});

it('disables flags in unknown environments', () => {
  process.env.NODE_ENV = 'unknown';
  expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(false);
});
it.each(['test', 'development'])('enables flags in %s', (nodeEnv) => {
  process.env.NODE_ENV = nodeEnv;
  expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
});
it.each(['production'])('disables flags in %s', (nodeEnv) => {
  process.env.NODE_ENV = nodeEnv;
  expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(false);
});

describe('in test', () => {
  beforeEach(() => {
    process.env.NODE_ENV = 'test';
  });

  describe('disable', () => {
    it('disables a flag', () => {
      disable('PERSISTENT_EXAMPLE');
      expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(false);
    });

    it('changes the overrides identity', () => {
      const prevOverrides = getOverrides();
      disable('PERSISTENT_EXAMPLE');
      expect(getOverrides()).not.toBe(prevOverrides);
    });
  });

  describe('reset', () => {
    it('undoes disable', () => {
      disable('PERSISTENT_EXAMPLE');
      expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(false);

      reset();
      expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
    });

    it('changes the overrides identity', () => {
      const prevOverrides = getOverrides();
      reset();
      expect(getOverrides()).not.toBe(prevOverrides);
    });
  });

  describe('the Jest environment configuration', () => {
    test('[leaves a modified state]', () => {
      disable('PERSISTENT_EXAMPLE');
      expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(false);
    });

    it('automatically resets between tests', () => {
      expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
    });
  });
});
