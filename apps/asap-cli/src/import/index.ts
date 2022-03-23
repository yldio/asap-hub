import csvParse from 'csv-parse';
import pump from 'pump';
import through from 'through2-concurrent';
import { createReadStream } from 'fs';
import insertUsers from './users/insert';
import parseUsers from './users/parse';

const parse =
  <T>(parser: (arg: string[]) => T, transformer: (arg: T) => Promise<void>) =>
  (src: string): Promise<void> =>
    /* eslint-enable no-unused-vars */
    new Promise((resolve, reject) => {
      pump(
        createReadStream(src),
        csvParse({ from_line: 2 }),
        through.obj({ maxConcurrency: 10 }, async (chunk, _, callback) => {
          await transformer(parser(chunk));
          return callback(null);
        }),
        (err?: Error) => {
          if (err) {
            return reject(err);
          }
          return resolve();
        },
      );
    });

const users = parse(
  parseUsers,
  insertUsers({
    upsert: true,
  }),
);

export { users };
