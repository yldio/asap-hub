// No idea why CRA wouldn't let me put this as a normal @types package.
// When I tried, it spit out errors that it couldn't find all the other @types in our workspace,
// even though the frontend doesn't use them at all.
// I'm not willing to add useless devDeps on all @types we have to the frontend though, so instead I just put this file here.
declare module 'react-titled' {
  interface TitledProps {
    readonly title: (parentTitle: string) => string;
    readonly onChange?: (title: string) => void;
  }
  export declare const Titled: React.FC<TitledProps>;
}
