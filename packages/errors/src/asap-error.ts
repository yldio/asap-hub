export class GenericError extends Error {
  constructor(public cause: Error | unknown) {
    super();
  }
}
