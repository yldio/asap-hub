import parser from 'csv-parse';
import pump from 'pump';
import through from 'through2-concurrent';
import { createReadStream } from 'fs';
import insert from './insert';
import parseData, { Data } from './parse-data';

const parse = (transform: (data: Data) => Promise<void>) => (
  src: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    pump(
      createReadStream(src),
      // eslint-disable-next-line @typescript-eslint/camelcase
      parser({ from_line: 2 }),
      through.obj({ maxConcurrency: 10 }, async (chunk, _, callback) => {
        await transform(parseData(chunk));
        return callback(null);
      }),
      (err: Error) => {
        if (err) {
          return reject(err);
        }
        return resolve();
      },
    );
  });
};

export const importUsers = parse(
  insert({
    upsert: true,
  }),
);
