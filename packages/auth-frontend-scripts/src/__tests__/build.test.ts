import { execSync } from 'child_process';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { build } from '..';

jest.mock('child_process');
jest.mock('fs');

const mockExecSync = execSync as jest.MockedFunction<typeof execSync>;
const mockCopyFileSync = copyFileSync as jest.MockedFunction<
  typeof copyFileSync
>;
const mockReadFileSync = readFileSync as jest.MockedFunction<
  typeof readFileSync
>;
const mockWriteFileSync = writeFileSync as jest.MockedFunction<
  typeof writeFileSync
>;

afterEach(() => {
  mockExecSync.mockReset();
  mockCopyFileSync.mockReset();
  mockReadFileSync.mockReset();
  mockWriteFileSync.mockReset();
});

describe('build', () => {
  it('should call execSync with correct params', () => {
    build('/', {});
    expect(mockExecSync).toHaveBeenCalledWith('yarn run react-scripts build', {
      env: {},
      stdio: 'pipe',
    });
  });
  it('should throw error if execSync fails', () => {
    mockExecSync.mockImplementation(() => {
      throw new Error('buildFailed');
    });
    expect(() => {
      build('/', {});
    }).toThrow();
  });

  it('should replace the script file names with main.chunk and 2.chunk', () => {
    mockReadFileSync.mockReturnValue(`
      <!doctype html>
        <html lang="en">
        <head>
          <script
            defer="defer"
            src="https://dev.hub.asap.science/.auth/static/js/main.80665dab.js"
          />
        </head>
        </html>
      `);
    build('/', {});
    expect(mockReadFileSync).toBeCalledWith('/index.html');

    expect(mockCopyFileSync.mock.calls).toEqual([
      ['/static/js/main.80665dab.js', '/static/js/main.chunk.js'],
    ]);

    expect(mockWriteFileSync.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/index.html",
        "<!doctype html><html lang=\\"en\\"><head>
                <script defer=\\"defer\\" src=\\"https://dev.hub.asap.science/.auth/static/js/main.chunk.js\\"> </script></head><body></body></html>",
      ]
    `);
  });
});
