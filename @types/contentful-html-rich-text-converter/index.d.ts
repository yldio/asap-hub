declare module 'contentful-html-rich-text-converter' {
  export type InlineIFrameBody = [
    id: string,
    fields: {
      fields: {
        url: {
          'en-US': string;
        };
      };
    },
  ];

  export type InlineAssetBody = [id: string, fields: CreateAssetProps];

  function parseHtml(
    html: string,
    getAssetId?: (url: string) => string | null,
  ): unknown;
  function parseAssets(html: string): InlineAssetBody[];
  function parseIFrames(html: string): InlineIFrameBody[];

  export { parseHtml, parseAssets, parseIFrames };
}
