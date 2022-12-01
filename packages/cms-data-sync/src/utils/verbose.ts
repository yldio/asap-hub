import { isVerbose } from './setup';

export const verboseLog = (log: string): null => {
  if (!isVerbose()) {
    return null;
  }

  console.log('\x1b[32m', `[DEBUG] ${log}`);
  return null;
};
