export class AsapError extends Error {
  constructor(public cause: Error | unknown) {
    super();
  }
}
