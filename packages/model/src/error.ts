export type ErrorResponse = {
  error: string;
  message: string;
  statusCode: number;
  data?: Record<string, unknown>;
};
