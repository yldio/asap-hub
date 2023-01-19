import { Document, Node } from '@contentful/rich-text-types';
import { documentToHtmlString } from '@contentful/rich-text-html-renderer';

export type RichTextFromQuery = {
  json: Document;
  links: {
    assets: {
      block?: {
        sys: {
          id: string;
        };
        url: string;
        description?: string;
      }[];
    };
  };
};

type AssetById = {
  [assetId: string]: {
    alt?: string;
    url: string;
  };
};

export const parseRichText = (rtf: RichTextFromQuery) => {
  const assetById: AssetById | undefined = rtf.links.assets.block?.reduce(
    (assetInfoById: AssetById, asset) => ({
      ...assetInfoById,
      [asset.sys.id]: {
        alt: asset.description as string | undefined,
        url: asset.url,
      },
    }),
    {},
  );

  const options = {
    renderNode: {
      'embedded-asset-block': (node: Node) => {
        const assetId = node.data.target.sys.id as string;
        if (assetById && assetId && assetById[assetId]) {
          const { url, alt } = assetById[assetId];
          return `<img class="img-fluid" src="${url}" alt=${alt || ''}/>`;
        }
        throw new Error(
          `Asset with id ${assetId} does not exist in contentful`,
        );
      },
    },
  };
  return documentToHtmlString(rtf?.json, options);
};
