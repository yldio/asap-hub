import {
  isEnabled,
  disable,
  reset,
  getOverrides,
  setCurrentOverrides,
  enable,
  setEnvironment,
} from '..';

beforeEach(() => {
  setEnvironment('unknown');
});

it('defaults to development (in which we default flags to false) for when an environment is not set', () => {
  setEnvironment(undefined);
  expect(isEnabled('PERSISTENT_TEST_EXAMPLE')).toBe(false);
});

it('disables flags in unknown environments', () => {
  setEnvironment('unknown');
  expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(false);
});
it.each(['test'])('enables flags in %s', (nodeEnv) => {
  setEnvironment(nodeEnv);
  expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
});
it.each(['production'])('disables flags in %s', (nodeEnv) => {
  setEnvironment(nodeEnv);
  expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(false);
});

describe('in test', () => {
  beforeEach(() => {
    setEnvironment('test');
  });

  describe('setCurrentOverrides,', () => {
    it('overrides a given set of flags when overrides is empty', () => {
      reset();

      const actualOverrides = getOverrides();
      expect(actualOverrides).toEqual({});

      setCurrentOverrides({
        PERSISTENT_EXAMPLE: true,
      });
      expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
    });

    it('overrides a given set of flags', () => {
      disable('PERSISTENT_EXAMPLE');

      setCurrentOverrides({
        PERSISTENT_EXAMPLE: true,
      });

      expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
    });

    it('handles when is called without arguments', () => {
      setCurrentOverrides();
      expect(getOverrides()).toMatchObject({});
      expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
    });
  });
  describe('disable', () => {
    it('disables a flag', () => {
      disable('PERSISTENT_EXAMPLE');
      expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(false);
    });

    it('changes the overrides identity', () => {
      const previousOverrides = getOverrides();
      disable('PERSISTENT_EXAMPLE');
      expect(getOverrides()).not.toBe(previousOverrides);
    });
  });
  describe('enable', () => {
    it('disables a flag', () => {
      enable('PERSISTENT_EXAMPLE');
      expect(isEnabled('PERSISTENT_EXAMPLE')).toBe(true);
    });

    it('changes the overrides identity', () => {
      const previousOverrides = getOverrides();
      enable('PERSISTENT_EXAMPLE');
      expect(getOverrides()).not.toBe(previousOverrides);
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
