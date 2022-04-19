import { HTTPError } from 'got';

export function parseErrorResponseBody(err: HTTPError) {
  if (typeof err.response.body === 'string') {
    return JSON.parse(err.response.body);
  } else {
    return err.response.body;
  }
}
