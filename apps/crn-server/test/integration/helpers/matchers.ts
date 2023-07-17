expect.extend({
  toBeCloseInTimeTo: function (
    received: string,
    expected: string,
    limit: number = 10000,
  ) {
    const d1 = new Date(received);
    const d2 = new Date(expected);

    if (Math.abs(d1.getTime() - d2.getTime()) < limit) {
      return {
        message: () =>
          `Expected ${this.utils.printReceived(
            received,
          )} to be within ${limit}ms of ${this.utils.printExpected(expected)}`,
        pass: true,
      };
    }
    return {
      message: () =>
        `Expected ${this.utils.printReceived(
          received,
        )} to be within ${limit}ms of ${this.utils.printExpected(expected)}`,
      pass: false,
    };
  },
});

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeCloseInTimeTo(expected: string, limit?: number): CustomMatcherResult;
    }
  }
}

export {};
