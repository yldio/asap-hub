import { waitFor } from '@testing-library/dom';

import streamSaver from 'streamsaver';
import { createCsvFileStream } from '..';

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
