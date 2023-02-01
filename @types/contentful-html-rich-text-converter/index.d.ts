declare module 'contentful-html-rich-text-converter' {
  function parseHtml(
    html: string,
    getAssetId?: (url: string) => string | null,
  ): unknown;
  function parseAssets(
    html: string,
    getAssetId?: (url: string) => string | null,
  ): unknown;

  export { parseHtml, parseAssets };
}
