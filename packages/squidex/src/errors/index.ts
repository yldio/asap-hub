export class SquidexError extends Error {
  constructor(public cause?: unknown) {
    super();
  }
}

export class SquidexUnauthorizedError extends SquidexError {}

export class SquidexNotFoundError extends SquidexError {}

export class SquidexValidationError extends SquidexError {
  constructor(public cause?: unknown, public details: string[] = []) {
    super();
  }
}
