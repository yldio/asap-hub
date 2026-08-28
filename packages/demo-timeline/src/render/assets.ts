import { RenderAsset } from './types';

export const assetIndex = (assets: RenderAsset[]): Map<string, RenderAsset> =>
  new Map(assets.map((asset) => [asset.assetId, asset]));

// an unprobed asset is assumed to have audio, which is how it behaved before
// the ingest job started reporting it
export const assetHasAudio = (
  assets: Map<string, RenderAsset>,
  assetId: string,
): boolean => assets.get(assetId)?.hasAudio !== false;

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
