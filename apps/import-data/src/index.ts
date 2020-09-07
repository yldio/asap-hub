/* eslint-disable no-console */

import parse from 'csv-parse';
import path from 'path';
import pump from 'pump';
import through from 'through2-concurrent';
import { createReadStream } from 'fs';
import createEntities from './create-entities';
import parseData, { Data } from './parse-data';

const parseAndTransform = (transform: (data: Data) => Promise<void>) => (
  src: string,
): Promise<void> => {
  return new Promise((resolve, reject) => {
    pump(
      createReadStream(src),
      parse(),
      through.obj({ maxConcurrency: 10 }, async (chunk, _, callback) => {
        const data = parseData(chunk);
        if (data.applicationNumber === 'Application ID') {
          return callback(null);
        }
        await transform(data);
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

export const parseAndCreateEntities = parseAndTransform(createEntities());

const src = path.join(__dirname, '../../../asap_grantees_information.csv');
parseAndCreateEntities(src).catch(console.error);
