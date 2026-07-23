// the /production subpath is resolvable at runtime via the package exports map,
// which TS 4.9 under moduleResolution "node" cannot read; same API as the root export
declare module '@tanstack/react-query-devtools/production' {
  export * from '@tanstack/react-query-devtools';
}
