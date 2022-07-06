import { execSync } from 'child_process';
import { copyFileSync, readFileSync, writeFileSync } from 'fs';
import { buildScript, replaceScripts } from '..';

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

beforeEach(() => {
  mockExecSync.mockClear();
  mockCopyFileSync.mockClear();
  mockReadFileSync.mockClear();
  mockWriteFileSync.mockClear();
});

describe('buildScript', () => {
  it('should call execSync with correct params', () => {
    buildScript({});
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
      buildScript({});
    }).toThrow();
  });
});

describe('replaceScripts', () => {
  it('should replace the script file names with main.chunk and 2.chunk', () => {
    mockReadFileSync.mockReturnValue(`
      <!doctype html>
        <html lang="en">
          <body>
            <script src="/static/js/2.eb5d7501.chunk.js">
            </script><script src="/static/js/main.f9ee5131.chunk.js"></script>
          </body>
        </html>
      `);
    replaceScripts('/');
    expect(mockReadFileSync).toBeCalledWith('/index.html');

    expect(mockCopyFileSync.mock.calls).toEqual([
      ['/static/js/main.f9ee5131.chunk.js', '/static/js/main.chunk.js'],
      ['/static/js/2.eb5d7501.chunk.js', '/static/js/2.chunk.js'],
    ]);

    expect(mockWriteFileSync.mock.calls[0]).toMatchInlineSnapshot(`
      Array [
        "/index.html",
        "<!doctype html><html lang=\\"en\\"><head></head><body>
                  <script src=\\"/static/js/2.chunk.js\\">
                  </script><script src=\\"/static/js/main.chunk.js\\"></script>
                
              
            </body></html>",
      ]
    `);
  });
});
