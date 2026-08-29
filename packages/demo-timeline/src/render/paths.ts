const inWorkDir = (workDir: string, name: string): string =>
  `${workDir.replace(/\/+$/, '')}/${name}`;

export const clipOutputPath = (workDir: string, index: number): string =>
  inWorkDir(workDir, `clip-${index}.mp4`);

export const titlePngPath = (workDir: string, clipIndex: number): string =>
  inWorkDir(workDir, `title-${clipIndex}.png`);

export const bannerPngPath = (workDir: string, bannerIndex: number): string =>
  inWorkDir(workDir, `banner-${bannerIndex}.png`);

export const cursorPngPath = (
  workDir: string,
  clipIndex: number,
  effectIndex: number,
): string => inWorkDir(workDir, `cursor-${clipIndex}-${effectIndex}.png`);

export const pointerPngPath = (workDir: string, clipIndex: number): string =>
  inWorkDir(workDir, `pointer-${clipIndex}.png`);

export const concatListPath = (workDir: string): string =>
  inWorkDir(workDir, 'concat.txt');
