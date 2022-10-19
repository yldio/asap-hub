import { createReadStream, ReadStream } from 'fs';
import { PassThrough } from 'stream';
import { parse } from '../../src';

jest.mock('fs');

const mockcreateReadStream = createReadStream as jest.MockedFunction<
  typeof createReadStream
>;

describe('CSV Parser', () => {
  const mockParser = jest.fn().mockReturnValue('test');
  const mockTransformer = jest.fn().mockResolvedValue(undefined);
  const csvParser = parse(mockParser, mockTransformer);

  test('should parse a CSV file', async () => {
    const mockedStream = new PassThrough();
    mockcreateReadStream.mockReturnValue(mockedStream as unknown as ReadStream);

    const promise = csvParser('some-file.csv');
    mockedStream.emit('data', 'a,b,c\n');
    mockedStream.emit('data', 'a,b,c\n');
    mockedStream.emit('end');

    await promise;

    expect(mockcreateReadStream).toHaveBeenCalledWith('some-file.csv');
    expect(mockParser).toHaveBeenCalledWith(['a', 'b', 'c']);
    expect(mockTransformer).toHaveBeenCalledWith('test');
  });

  test('should reject on error from reading the file', async () => {
    const mockedStream = new PassThrough();
    mockcreateReadStream.mockReturnValue(mockedStream as unknown as ReadStream);

    const promise = csvParser('some-file.csv');
    mockedStream.emit('error', new Error('some-error'));
    mockedStream.emit('end');

    expect(promise).rejects.toThrow('some-error');
  });
});
