import { Readable, Transform, TransformCallback } from 'stream';
import {
  Results,
  Squidex,
  RestUser,
  RestTeam,
  RestResearchOutput,
} from '@asap-hub/squidex';

export type CollectionEntityType = RestUser | RestTeam | RestResearchOutput;
export type CollectionEntityName = 'users' | 'teams' | 'research-outputs';
export type CollectionEntityTypeMapper<T extends CollectionEntityName> =
  T extends 'users'
    ? RestUser
    : T extends 'teams'
    ? RestTeam
    : T extends 'research-outputs'
    ? RestResearchOutput
    : never;

interface ApplyToAllItemsInCollectionProcessEntityProcessor<
  T extends CollectionEntityType,
> {
  (entity: T, squidexClient: Squidex<T>): Promise<void>;
}

interface ApplyToAllItemsInCollectionProcessEntityCallable<
  T extends CollectionEntityName,
> {
  (
    processor: ApplyToAllItemsInCollectionProcessEntityProcessor<
      CollectionEntityTypeMapper<T>
    >,
  ): Promise<void>;
}

export const applyToAllItemsInCollection =
  <T extends CollectionEntityName>(entityName: T) =>
  async (
    processEntity: ApplyToAllItemsInCollectionProcessEntityProcessor<
      CollectionEntityTypeMapper<T>
    >,
  ): Promise<void> => {
    const squidexClient = new Squidex<CollectionEntityTypeMapper<T>>(
      entityName,
      {
        unpublished: true,
      },
    );

    let pointer = 0;
    let result: Results<CollectionEntityTypeMapper<T>>;

    do {
      result = await squidexClient.fetch({
        $top: 10,
        $skip: pointer,
        $orderby: 'created asc',
      });

      for (const item of result.items) {
        await processEntity(item, squidexClient);
      }

      pointer += 10;
    } while (pointer < result.total);
  };

export class CollectionStream<T extends CollectionEntityName> extends Readable {
  public constructor(
    private callable: ApplyToAllItemsInCollectionProcessEntityCallable<T>,
  ) {
    super();
  }

  public async loop(): Promise<void> {
    await this.callable(
      async (item: CollectionEntityTypeMapper<T>): Promise<void> => {
        this.push(item);
      },
    );

    this.emit('end');
  }
}

export class ChunkedCollectionStream<
  T extends CollectionEntityName,
> extends Transform {
  private chunk: CollectionEntityTypeMapper<T>[] = [];

  public constructor(private chunkSize: number = 10_000) {
    super();
  }

  public _transform(
    entity: CollectionEntityTypeMapper<T>,
    encoding: string,
    callback: TransformCallback,
  ): void {
    if (this.chunk.length >= this.chunkSize) {
      this.push(this.chunk);
      this.chunk = [];
    }

    callback();
  }

  public _flush(callback: TransformCallback): void {
    this.push(this.chunk);
    this.chunk = [];

    callback();
  }
}

interface StreamFunction<T> {
  (
    chunk: T,
    encoding: string,
    callback: (error?: Error | null) => void,
  ): unknown;
}

export const executeStreamCallback =
  <T>(entityProcessor: (chunk: T) => unknown): StreamFunction<T> =>
  async (
    chunk: T,
    encoding: string,
    callback: (error?: Error | null) => void,
  ): Promise<void> => {
    await entityProcessor(chunk);
    callback();
  };
