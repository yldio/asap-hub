export type Resource = {
  title: string;
  description?: string;
} & (
  | {
      type: 'Note';
    }
  | {
      type: 'Link';
      externalLink: string;
    }
);
