import {
  AbortMultipartUploadCommand,
  CompleteMultipartUploadCommand,
  CreateMultipartUploadCommand,
  DeleteObjectsCommand,
  GetObjectCommand,
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
