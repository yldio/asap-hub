import { isVerbose } from './setup';

const getBashColor = (level: string): string => {
  switch (level) {
    case 'ERROR':
    case 'ERROR-DEBUG':
      return '\x1b[31m';
    case 'WARNING':
      return '\x1b[33m';
    case 'INFO':
      return '\x1b[32m';
    case 'DEBUG':
    default:
      return '\x1b[34m';
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
  /** eslint-disable no-console **/
  console.log(getBashColor(level), `[${level}] ${log}`);
};

export const logger = (log: string, level: string = 'DEBUG'): void => {
  if (levelRequiresVerbose(level) && !isVerbose()) {
    return;
  }

  printLog(log, level);

  return;
};
