declare module 'contentful-html-rich-text-converter' {
  function parseHtml(html: string): unknown;
  function parseAssets(html: string): unknown;

  export { parseHtml, parseAssets };
}
