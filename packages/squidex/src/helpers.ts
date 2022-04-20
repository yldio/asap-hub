import { HTTPError } from 'got';

export function parseErrorResponseBody(err: HTTPError): unknown {
  if (typeof err.response.body === 'string') {
    return JSON.parse(err.response.body);
  }
  return err.response.body;
}
