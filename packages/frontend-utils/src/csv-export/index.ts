/* eslint-disable-next-line import/no-unresolved */
import { stringify, Options } from 'csv-stringify/browser/esm';
import { WritableStream } from 'web-streams-polyfill/ponyfill';
import streamSaver from 'streamsaver';

export type CSVValue = string | undefined | boolean;

export const EXCEL_CELL_CHARACTER_LIMIT = 32767;
const EXCEL_CELL_SAFE_CHARACTER_LIMIT = Math.floor(
  (EXCEL_CELL_CHARACTER_LIMIT - 2) / 2, // Cell likely wrapped with ""; " escapes to ""
);

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
    .on('readable', () => {
      let row;
      while ((row = stringifier.read()) !== null) {
        fileWriter.write(row);
      }
    })
    .on('end', () => fileWriter.close());
};
