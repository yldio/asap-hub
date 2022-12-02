import { isVerbose } from './setup';

export const RED_COLOR = '\x1b[31m';
export const YELLOW_COLOR = '\x1b[33m';
export const GREEN_COLOR = '\x1b[32m';
export const BLUE_COLOR = '\x1b[34m';

const getBashColor = (level: string): string => {
  switch (level) {
    case 'ERROR':
    case 'ERROR-DEBUG':
      return RED_COLOR;
    case 'WARNING':
      return YELLOW_COLOR;
    case 'INFO':
      return GREEN_COLOR;
    case 'DEBUG':
    default:
      return BLUE_COLOR;
  }
};

const levelRequiresVerbose = (level: string): boolean => {
  switch (level) {
    case 'ERROR':
    case 'WARNING':
    case 'INFO':
      return false;
    case 'DEBUG':
    case 'ERROR-DEBUG':
    default:
      return true;
  }
};

const printLog = (log: string, level: string): void => {
  /* eslint-disable no-console */
  console.log(getBashColor(level), `[${level}] ${log}`);
};

export const logger = (log: string, level: string = 'DEBUG'): void => {
  if (levelRequiresVerbose(level) && !isVerbose()) {
    return;
  }

  printLog(log, level);
};
