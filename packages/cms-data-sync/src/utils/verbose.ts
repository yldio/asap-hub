import { isVerbose } from './setup';

const verboseLog = async (log: string): Promise<null> => {
  if (!isVerbose()) {
    return null;
  }

  console.log('\x1b[32m', `[DEBUG] ${log}`);
  return null;
};
