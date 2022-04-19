export class ASAPError extends Error {
  public readonly isASAP = true;

  public constructor(
    public readonly error: string,
    public readonly statusCode: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
  }

  public static isASAPError(error: Error|ASAPError): error is ASAPError {
    return (error as ASAPError)?.isASAP;
  }
}
