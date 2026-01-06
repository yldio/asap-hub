import Boom from '@hapi/boom';

import { Logger } from '../../utils';

interface ErrorContext {
  tableName: string;
  cookieId: string;
}

/**
 * Handles DynamoDB errors by extracting error information, logging it, and throwing a Boom error.
 * This ensures consistent error handling across cookie preference handlers.
 */
export const handleDynamoDBError = (
  error: unknown,
  logger: Logger,
  operation: 'get' | 'save',
  context: ErrorContext,
): never => {
  // Extract error message from various error types (Error, AWS SDK errors, etc.)
  let errorMessage = 'Unknown error';
  let errorName = 'Error';

  if (error instanceof Error) {
    errorMessage = error.message || error.name || String(error);
    errorName = error.name || 'Error';
  } else {
    errorMessage = String(error);
  }

  const operationVerb = operation === 'get' ? 'fetch' : 'save';
  const preposition = operation === 'get' ? 'from' : 'to';
  logger.error(
    `Failed to ${operationVerb} cookie preferences ${preposition} DynamoDB: ${errorName}`,
    {
      error: errorMessage,
      errorName,
      tableName: context.tableName,
      cookieId: context.cookieId,
      // Log error code if available (for AWS SDK errors)
      errorCode: (error as { $metadata?: { httpStatusCode?: number } })
        ?.$metadata?.httpStatusCode,
    },
  );
  // Throw Boom error to preserve error message - this will be serialized to browser response
  const boomMessage = errorMessage || errorName || 'Unknown error';
  throw Boom.badImplementation(boomMessage);
};
