import { ApiError, uploadPart } from '../api/client';
import type { PartUrl, UploadedPart } from '../api/types';

export type PartPlan = { partNumber: number; start: number; end: number };

export const planParts = (fileSize: number, partSize: number): PartPlan[] => {
  if (fileSize <= 0 || partSize <= 0) return [];
  const count = Math.ceil(fileSize / partSize);
  return Array.from({ length: count }, (unused, index) => ({
    partNumber: index + 1,
    start: index * partSize,
    end: Math.min((index + 1) * partSize, fileSize),
  }));
};

export const MAX_CONCURRENT_PARTS = 6;
export const MAX_PART_ATTEMPTS = 3;

const backoffMs = (attempt: number): number => 1000 * 2 ** (attempt - 1);

const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });

export type UploadPartsOptions = {
  file: Blob;
  plans: PartPlan[];
  urls: PartUrl[];
  signal?: AbortSignal;
  concurrency?: number;
  onPartDone?: (part: UploadedPart, bytes: number) => void;
  put?: (url: string, blob: Blob, signal?: AbortSignal) => Promise<string>;
  wait?: (milliseconds: number) => Promise<void>;
};

const uploadOnePart = async (
  plan: PartPlan,
  url: string,
  { file, signal, put = uploadPart, wait = delay }: UploadPartsOptions,
): Promise<UploadedPart> => {
  let lastError: unknown;
  for (let attempt = 1; attempt <= MAX_PART_ATTEMPTS; attempt += 1) {
    if (signal?.aborted) throw new ApiError(0, 'Upload cancelled', 'aborted');
    try {
      // eslint-disable-next-line no-await-in-loop
      const eTag = await put(url, file.slice(plan.start, plan.end), signal);
      return { partNumber: plan.partNumber, eTag };
    } catch (error) {
      lastError = error;
      if (signal?.aborted) throw error;
      if (attempt < MAX_PART_ATTEMPTS) {
        // eslint-disable-next-line no-await-in-loop
        await wait(backoffMs(attempt));
      }
    }
  }
  throw lastError;
};

export const uploadParts = async (
  options: UploadPartsOptions,
): Promise<UploadedPart[]> => {
  const {
    plans,
    urls,
    onPartDone,
    concurrency = MAX_CONCURRENT_PARTS,
  } = options;
  const urlByPart = new Map(
    urls.map(({ partNumber, url }) => [partNumber, url]),
  );
  const done: UploadedPart[] = [];
  let next = 0;

  const worker = async (): Promise<void> => {
    for (;;) {
      const plan = plans[next];
      if (!plan) return;
      next += 1;
      const url = urlByPart.get(plan.partNumber);
      if (!url)
        throw new ApiError(0, `Missing upload URL for part ${plan.partNumber}`);
      // eslint-disable-next-line no-await-in-loop
      const part = await uploadOnePart(plan, url, options);
      done.push(part);
      onPartDone?.(part, plan.end - plan.start);
    }
  };

  await Promise.all(
    Array.from({ length: Math.min(concurrency, plans.length) }, worker),
  );

  return done;
};
