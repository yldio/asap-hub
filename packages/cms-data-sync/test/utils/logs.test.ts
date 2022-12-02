import {
  logger,
  RED_COLOR,
  YELLOW_COLOR,
  GREEN_COLOR,
  BLUE_COLOR,
} from '../../src/utils';

describe('Logging', () => {
  const consoleLogRef = console.log;
  const oldVerboseSetting = process.env.VERBOSE_DATA_SYNC;

  beforeEach(() => {
    console.log = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    console.log = consoleLogRef;
    process.env.VERBOSE_DATA_SYNC = oldVerboseSetting;
  });

  describe('without verbose mode', () => {
    process.env.VERBOSE_DATA_SYNC = 'false';

    it('logs ERROR in red', () => {
      logger('Test', 'ERROR');
      expect(console.log).toHaveBeenCalledWith(RED_COLOR, '[ERROR] Test');
    });

    it("doesn't log ERROR-DEBUG", () => {
      logger('Test', 'ERROR-DEBUG');
      expect(console.log).not.toHaveBeenCalled();
    });

    it('logs WARNING in yellow', () => {
      logger('Test', 'WARNING');
      expect(console.log).toHaveBeenCalledWith(YELLOW_COLOR, '[WARNING] Test');
    });

    it('logs INFO in green', () => {
      logger('Test', 'INFO');
      expect(console.log).toHaveBeenCalledWith(GREEN_COLOR, '[INFO] Test');
    });

    it("doesn't log DEBUG", () => {
      logger('Test', 'DEBUG');
      expect(console.log).not.toHaveBeenCalled();
    });

    it("doesn't log non-existing log levels", () => {
      logger('Test', 'NOT-EXISTING');
      expect(console.log).not.toHaveBeenCalled();
    });
  });

  describe('with verbose mode', () => {
    process.env.VERBOSE_DATA_SYNC = 'true';

    it('logs ERROR in red', () => {
      logger('Test', 'ERROR');
      expect(console.log).toHaveBeenCalledWith(RED_COLOR, '[ERROR] Test');
    });

    it('logs ERROR-DEBUG in red', () => {
      logger('Test', 'ERROR-DEBUG');
      expect(console.log).toHaveBeenCalledWith(RED_COLOR, '[ERROR-DEBUG] Test');
    });

    it('logs WARNING in yellow', () => {
      logger('Test', 'WARNING');
      expect(console.log).toHaveBeenCalledWith(YELLOW_COLOR, '[WARNING] Test');
    });

    it('logs INFO in green', () => {
      logger('Test', 'INFO');
      expect(console.log).toHaveBeenCalledWith(GREEN_COLOR, '[INFO] Test');
    });

    it('logs DEBUG in blue', () => {
      logger('Test', 'DEBUG');
      expect(console.log).toHaveBeenCalledWith(BLUE_COLOR, '[DEBUG] Test');
    });

    it('logs non-existing log levels as debug', () => {
      logger('Test', 'NOT-EXISTING');
      expect(console.log).toHaveBeenCalledWith(
        BLUE_COLOR,
        '[NOT-EXISTING] Test',
      );
    });
  });
});
