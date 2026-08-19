import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
  ListMultipartUploadsCommand,
  ListObjectsV2Command,
  PutObjectCommand,
  S3Client,
  S3ClientConfig,
  UploadPartCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Readable } from 'stream';
import { getBucketName, isLocal, localS3Endpoint } from './config';

let client: S3Client | undefined;

export const getS3Client = (): S3Client => {
  if (!client) {
    const config: S3ClientConfig = isLocal()
      ? {
          endpoint: localS3Endpoint(),
          forcePathStyle: true,
          region: 'us-east-1',
          credentials: {
            accessKeyId: 'minioadmin',
            secretAccessKey: 'minioadmin',
          },
        }
      : {};
    client = new S3Client(config);
  }
  return client;
};

export const setS3Client = (next: S3Client | undefined): void => {
  client = next;
};

export const rawKey = (videoId: string): string =>
  `raw/${videoId}/original.mp4`;

export const mediaPrefix = (videoId: string): string => `media/${videoId}/`;

export const createMultipartUpload = async (
  videoId: string,
): Promise<{ uploadId: string; key: string }> => {
  const key = rawKey(videoId);
  const response = await getS3Client().send(
    new CreateMultipartUploadCommand({
      Bucket: getBucketName(),
      Key: key,
      ContentType: 'video/mp4',
    }),
  );
  return { uploadId: response.UploadId ?? '', key };
};

export const signUploadParts = async (
  videoId: string,
  uploadId: string,
  partNumbers: number[],
): Promise<{ partNumber: number; url: string }[]> =>
  Promise.all(
    partNumbers.map(async (partNumber) => ({
      partNumber,
      url: await getSignedUrl(
        getS3Client(),
        new UploadPartCommand({
          Bucket: getBucketName(),
          Key: rawKey(videoId),
          UploadId: uploadId,
          PartNumber: partNumber,
        }),
        { expiresIn: 3600 },
      ),
    })),
  );

export const completeMultipartUpload = async (
  videoId: string,
  uploadId: string,
  parts: { partNumber: number; eTag: string }[],
): Promise<void> => {
  await getS3Client().send(
    new CompleteMultipartUploadCommand({
      Bucket: getBucketName(),
      Key: rawKey(videoId),
      UploadId: uploadId,
      MultipartUpload: {
        Parts: parts
          .slice()
          .sort((a, b) => a.partNumber - b.partNumber)
          .map(({ partNumber, eTag }) => ({
            PartNumber: partNumber,
            ETag: eTag,
          })),
      },
    }),
  );
};

export const abortMultipartUpload = async (
  videoId: string,
  uploadId: string,
): Promise<void> => {
  await getS3Client().send(
    new AbortMultipartUploadCommand({
      Bucket: getBucketName(),
      Key: rawKey(videoId),
      UploadId: uploadId,
    }),
  );
};

export const putObject = async (
  key: string,
  body: Buffer | string,
  contentType: string,
): Promise<void> => {
  await getS3Client().send(
    new PutObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      Body: body,
      ContentType: contentType,
    }),
  );
};

export const getObject = async (
  key: string,
  range?: string,
): Promise<{
  body: Readable;
  contentLength?: number;
  contentRange?: string;
  contentType?: string;
}> => {
  const response = await getS3Client().send(
    new GetObjectCommand({
      Bucket: getBucketName(),
      Key: key,
      ...(range ? { Range: range } : {}),
    }),
  );
  return {
    body: response.Body as Readable,
    contentLength: response.ContentLength,
    contentRange: response.ContentRange,
    contentType: response.ContentType,
  };
};

export const deletePrefix = async (prefix: string): Promise<void> => {
  let continuationToken: string | undefined;
  do {
    const listed = await getS3Client().send(
      new ListObjectsV2Command({
        Bucket: getBucketName(),
        Prefix: prefix,
        ContinuationToken: continuationToken,
      }),
    );
    const keys = (listed.Contents || [])
      .map(({ Key }) => Key)
      .filter((key): key is string => Boolean(key));
    if (keys.length) {
      await getS3Client().send(
        new DeleteObjectsCommand({
          Bucket: getBucketName(),
          Delete: { Objects: keys.map((Key) => ({ Key })) },
        }),
      );
    }
    continuationToken = listed.IsTruncated
      ? listed.NextContinuationToken
      : undefined;
  } while (continuationToken);
};

// in-flight multipart uploads keep their parts billable and are invisible to
// ListObjectsV2, so deleting the objects under a prefix is not enough to free
// the storage; every upload still open on that prefix has to be aborted too
export const abortMultipartUploadsUnder = async (
  prefix: string,
): Promise<void> => {
  // MinIO answers a prefixed ListMultipartUploads with an empty set, so when a
  // prefixed page comes back empty the whole bucket is listed and filtered here
  const abortPage = async (usePrefix: boolean): Promise<number> => {
    let keyMarker: string | undefined;
    let uploadIdMarker: string | undefined;
    let aborted = 0;
    do {
      const listed = await getS3Client().send(
        new ListMultipartUploadsCommand({
          Bucket: getBucketName(),
          ...(usePrefix ? { Prefix: prefix } : {}),
          KeyMarker: keyMarker,
          UploadIdMarker: uploadIdMarker,
        }),
      );
      const uploads = (listed.Uploads || []).filter(
        (upload): upload is { Key: string; UploadId: string } =>
          Boolean(upload.Key?.startsWith(prefix) && upload.UploadId),
      );
      await Promise.all(
        uploads.map(({ Key, UploadId }) =>
          getS3Client().send(
            new AbortMultipartUploadCommand({
              Bucket: getBucketName(),
              Key,
              UploadId,
            }),
          ),
        ),
      );
      aborted += uploads.length;
      if (listed.IsTruncated) {
        keyMarker = listed.NextKeyMarker;
        uploadIdMarker = listed.NextUploadIdMarker;
      } else {
        keyMarker = undefined;
        uploadIdMarker = undefined;
      }
    } while (keyMarker || uploadIdMarker);
    return aborted;
  };

  if ((await abortPage(true)) === 0) {
    await abortPage(false);
  }
};
