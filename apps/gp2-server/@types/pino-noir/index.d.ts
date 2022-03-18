declare module 'pino-noir' {
  function noir(
    paths: any,
    censor: any,
  ): { redaction: import('pino').SerializerFn };

  export default noir;
}
