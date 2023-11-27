/* eslint-disable-next-line import/no-unresolved */
import { Options, stringify } from 'csv-stringify/browser/esm';
import streamSaver from 'streamsaver';
import { WritableStream } from 'web-streams-polyfill/ponyfill';

export type CSVValue = string | undefined | boolean;

export const EXCEL_CELL_CHARACTER_LIMIT = 32767;
const EXCEL_CELL_SAFE_CHARACTER_LIMIT = Math.floor(
  (EXCEL_CELL_CHARACTER_LIMIT - 2) / 2, // Cell likely wrapped with ""; " escapes to ""
);

export const caseInsensitive = (a: string, b: string) =>
  a.localeCompare(b, undefined, { sensitivity: 'base' });

export const htmlToCsvText = (html: string = '') => {
  const doc = document.createElement('DIV');
  doc.innerHTML = html;
  return (doc.textContent || doc.innerText || '').substring(
    0,
    EXCEL_CELL_SAFE_CHARACTER_LIMIT,
  );
};

export const createCsvFileStream = (fileName: string, csvOptions?: Options) => {
  // If the WritableStream is not available (Firefox, Safari), take it from the ponyfill
  if (!window.WritableStream) {
    // Upgrading to TS 4.8 complains about this polyfil's types. Hoping we can remove this at some point
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    streamSaver.WritableStream = WritableStream;
  }
  const fileWriter = streamSaver.createWriteStream(fileName).getWriter();
  const stringifier = stringify({ bom: true, ...csvOptions });
  return stringifier
    .on('readable', async () => {
      async function processRow() {
        const row = await stringifier.read();

        if (row !== null) {
          await fileWriter.write(row);
          await processRow();
        }
      }

      await processRow();
    })
    .on('end', () => fileWriter.close());
};
