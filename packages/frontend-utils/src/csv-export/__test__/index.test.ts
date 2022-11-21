import { waitFor } from '@testing-library/dom';

import streamSaver from 'streamsaver';
import {
  caseInsensitive,
  createCsvFileStream,
  EXCEL_CELL_CHARACTER_LIMIT,
  htmlToCsvText,
} from '..';

const mockWriteStream = {
  write: jest.fn(),
  close: jest.fn(),
};
jest.mock('streamsaver', () => ({
  createWriteStream: jest.fn(() => ({
    getWriter: jest.fn(() => mockWriteStream),
  })),
}));

afterEach(() => {
  jest.clearAllMocks();
});

describe('createCsvFileStream', () => {
  it('Creates a CSV file write stream, writes headers and ordered data, closes saver stream when csv stream closed', async () => {
    const csvStream = createCsvFileStream('example.csv', {
      header: true,
      bom: false,
    });
    expect(streamSaver.createWriteStream).toHaveBeenCalledWith('example.csv');

    csvStream.write({
      a: 'test',
      b: 'test2',
    });
    csvStream.end();
    await waitFor(() => expect(mockWriteStream.close).toHaveBeenCalled());
    expect(mockWriteStream.write.mock.calls[0].toString())
      .toMatchInlineSnapshot(`
      "a,b
      test,test2
      "
    `);
  });
});

describe('caseInsensitive', () => {
  it('orders an string array alphabetically', () => {
    expect(['c', 'a', 'b', 'd'].sort(caseInsensitive)).toStrictEqual([
      'a',
      'b',
      'c',
      'd',
    ]);
  });
});

describe('htmlToCsvText', () => {
  it('Limits RTF fields to maximum safe excel cell character limit after escaping', () => {
    expect(
      htmlToCsvText('"'.repeat(EXCEL_CELL_CHARACTER_LIMIT * 2)).length,
    ).toBeLessThanOrEqual(EXCEL_CELL_CHARACTER_LIMIT);
  });
  it('Removes HTML from RTF fields', () => {
    expect(htmlToCsvText('<a>example</a> <p>123</p>')).toBe('example 123');
  });
});
