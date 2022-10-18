import csvParse from 'csv-parse';
import pump from 'pump';
import { createReadStream } from 'fs';
import through from 'through2-concurrent';

export const parse =
  <T>(
    parser: (arg: string[]) => T,
    transformer: (arg: T) => Promise<unknown>,
  ) =>
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
