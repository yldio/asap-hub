export class CRNError extends Error {
  public readonly isCRN = true;

  public constructor(
    public readonly error: string,
    public readonly statusCode: number,
    message: string,
    public readonly data?: unknown,
  ) {
    super(message);
  }

  public static isCRNError(error: Error|CRNError): error is CRNError {
    return (error as CRNError)?.isCRN;
  }
}
