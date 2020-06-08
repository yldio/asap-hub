// This is far from correct, but there is currently no way to type it
// so that the typical destructuring + conditional use case is supported
// without pretending the second tuple element cannot be undefined.
// Also, other things than Errors can be thrown but we don't want to
// bother with that either.
declare const intercept: <T>(promise: Promise<T>) => Promise<[Error, T]>;
export default intercept;
