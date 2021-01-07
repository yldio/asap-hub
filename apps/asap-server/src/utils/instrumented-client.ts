/* eslint-disable max-classes-per-file */

import * as opentracing from 'opentracing';
import { SpanContext, Span } from 'opentracing';
import { Squidex, SquidexGraphql } from '@asap-hub/squidex';
import gql from 'graphql-tag';
import { DocumentNode, OperationDefinitionNode, FieldNode } from 'graphql';

const startSpan = (spanName: string, tracingContext?: SpanContext): Span => {
  const tracer = opentracing.globalTracer();
  return tracer.startSpan(spanName, { childOf: tracingContext });
};

interface QueryAST extends Omit<DocumentNode, 'definitions'> {
  readonly definitions: ReadonlyArray<OperationDefinitionNode>;
}

const getQueryName = (query: string): string => {
  const parsedQuery = gql`
    ${query}
  ` as QueryAST;
  return parsedQuery.definitions
    .filter(({ operation }) => operation === 'query')
    .map(({ selectionSet }) => selectionSet)
    .filter(({ kind }) => kind === 'SelectionSet')
    .reduce(
      (memo, { selections }) =>
        memo.concat((selections as unknown) as FieldNode),
      [] as FieldNode[],
    )
    .map(({ name }) => name.value)
    .join(' ');
};

export class InstrumentedSquidexGraphql extends SquidexGraphql {
  tracingContext: SpanContext | undefined;

  constructor(ctxHeaders?: object) {
    super();
    const tracer = opentracing.globalTracer();
    this.tracingContext =
      tracer.extract(opentracing.FORMAT_HTTP_HEADERS, ctxHeaders) || undefined;
  }

  async request<T, V>(query: string): Promise<T> {
    const queryName = getQueryName(query);
    const spanName = queryName ? queryName : 'Graphql Request';
    const span = startSpan(spanName, this.tracingContext);
    span.log({ event: 'request_started', query });

    const res = await super.request<T, V>(query).catch((err) => {
      span.setTag(opentracing.Tags.ERROR, true);
      span.log({ event: 'error', 'error.object': err, message: err.message });
      throw err;
    });

    span.log({ event: 'request_finished' });
    span.finish();

    return res;
  }
}

export class InstrumentedSquidex<
  T extends { id: string; data: Record<string, unknown> }
> extends Squidex<T> {
  tracingContext: SpanContext | undefined;

  constructor(collection: string, ctxHeaders?: object) {
    super(collection);
    const tracer = opentracing.globalTracer();
    this.tracingContext =
      tracer.extract(opentracing.FORMAT_HTTP_HEADERS, ctxHeaders) || undefined;
  }

  async fetch(
    ...args: Parameters<Squidex<T>['fetch']>
  ): ReturnType<Squidex<T>['fetch']> {
    const span = startSpan(
      `Squidex Client: fetch - ${this.collection}`,
      this.tracingContext,
    );
    span.log({ event: 'request_started', ...args });

    const res = await super.fetch(...args).catch((err) => {
      span.setTag(opentracing.Tags.ERROR, true);
      span.log({ event: 'error', 'error.object': err, message: err.message });
      throw err;
    });

    span.log({ event: 'request_finished' });
    span.finish();

    return res;
  }

  async fetchById(
    ...args: Parameters<Squidex<T>['fetchById']>
  ): ReturnType<Squidex<T>['fetchById']> {
    const span = startSpan(
      `Squidex Client: fetchById - ${this.collection}`,
      this.tracingContext,
    );
    span.log({ event: 'request_started', ...args });

    const res = await super.fetchById(...args).catch((err) => {
      span.setTag(opentracing.Tags.ERROR, true);
      span.log({ event: 'error', 'error.object': err, message: err.message });
      throw err;
    });

    span.log({ event: 'request_finished' });
    span.finish();

    return res;
  }

  async fetchOne(
    ...args: Parameters<Squidex<T>['fetchOne']>
  ): ReturnType<Squidex<T>['fetchOne']> {
    const span = startSpan(
      `Squidex Client: fetchOne - ${this.collection}`,
      this.tracingContext,
    );
    span.log({ event: 'request_started', ...args });

    const res = await super.fetchOne(...args).catch((err) => {
      span.setTag(opentracing.Tags.ERROR, true);
      span.log({ event: 'error', 'error.object': err, message: err.message });
      throw err;
    });

    span.log({ event: 'request_finished' });
    span.finish();

    return res;
  }

  async create(
    ...args: Parameters<Squidex<T>['create']>
  ): ReturnType<Squidex<T>['create']> {
    const span = startSpan(
      `Squidex Client: create - ${this.collection}`,
      this.tracingContext,
    );
    span.log({ event: 'request_started', ...args });

    const res = await super.create(...args).catch((err) => {
      span.setTag(opentracing.Tags.ERROR, true);
      span.log({ event: 'error', 'error.object': err, message: err.message });
      throw err;
    });

    span.log({ event: 'request_finished' });
    span.finish();

    return res;
  }

  async patch(
    ...args: Parameters<Squidex<T>['patch']>
  ): ReturnType<Squidex<T>['patch']> {
    const span = startSpan(
      `Squidex Client: patch - ${this.collection}`,
      this.tracingContext,
    );
    span.log({ event: 'request_started', ...args });

    const res = await super.patch(...args).catch((err) => {
      span.setTag(opentracing.Tags.ERROR, true);
      span.log({ event: 'error', 'error.object': err, message: err.message });
      throw err;
    });

    span.log({ event: 'request_finished' });
    span.finish();

    return res;
  }

  async put(
    ...args: Parameters<Squidex<T>['put']>
  ): ReturnType<Squidex<T>['put']> {
    const span = startSpan(
      `Squidex Client: put - ${this.collection}`,
      this.tracingContext,
    );
    span.log({ event: 'request_started', ...args });

    const res = await super.put(...args).catch((err) => {
      span.setTag(opentracing.Tags.ERROR, true);
      span.log({ event: 'error', 'error.object': err, message: err.message });
      throw err;
    });

    span.log({ event: 'request_finished' });
    span.finish();

    return res;
  }

  async delete(
    ...args: Parameters<Squidex<T>['delete']>
  ): ReturnType<Squidex<T>['delete']> {
    const span = startSpan(
      `Squidex Client: delete - ${this.collection}`,
      this.tracingContext,
    );
    span.log({ event: 'request_started', ...args });

    const res = await super.delete(...args).catch((err) => {
      span.setTag(opentracing.Tags.ERROR, true);
      span.log({ event: 'error', 'error.object': err, message: err.message });
      throw err;
    });

    span.log({ event: 'request_finished' });
    span.finish();

    return res;
  }
}
