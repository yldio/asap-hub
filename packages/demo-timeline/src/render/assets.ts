import { RenderAsset } from './types';

export const assetIndex = (assets: RenderAsset[]): Map<string, RenderAsset> =>
  new Map(assets.map((asset) => [asset.assetId, asset]));

export const assetPath = (
  assets: Map<string, RenderAsset>,
  assetId: string,
  ownerId: string,
): string => {
  const asset = assets.get(assetId);
  if (!asset) {
    throw new Error(`${ownerId} references unknown asset ${assetId}`);
  }
  return asset.path;
};
