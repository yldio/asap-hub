import { richTextToMarkdown } from '../parsing';

describe('richTextToMarkdown', () => {
  it('handles basic text', () => {
    const result = richTextToMarkdown('text');
    expect(result).toBe(`text\n`);
  });

  it('handles formatted text', () => {
    const result = richTextToMarkdown(`
    <p>Some content</p>\n<p></p>\n<p><strong>dasdasd</strong></p>\n<p></p>\n<h2>dasdsad</h2>`);
    expect(result).toBe(`Some content

**dasdasd**

## dasdsad
`);
  });
});
